# ibm-maximo-docs-mcp

> **Unofficial** — This is a community project and is not officially affiliated with IBM.

Unofficial MCP (Model Context Protocol) servers for searching and reading IBM Maximo documentation, published to npm for zero-install use with any MCP-compatible AI client.

Compatible with IBM Bob, Claude Code, and Claude Desktop.

---

## Servers

| Package | Product | Topics | npm |
|---------|---------|--------|-----|
| [mas-core-docs-mcp](./mas-core-docs-mcp) | IBM Maximo Application Suite (full suite) | 1,000+ | [![npm](https://img.shields.io/npm/v/mas-core-docs-mcp)](https://www.npmjs.com/package/mas-core-docs-mcp) |
| [mas-manage-docs-mcp](./mas-manage-docs-mcp) | IBM Maximo Manage | 1,000+ | [![npm](https://img.shields.io/npm/v/mas-manage-docs-mcp)](https://www.npmjs.com/package/mas-manage-docs-mcp) |

Each server exposes three tools:

| Tool | Description |
|------|-------------|
| `search_*` | Keyword search with pagination — returns titles, snippets, and hrefs |
| `read_*` | Fetches a documentation page and returns it as Markdown |
| `get_*_toc` | Full table of contents, with optional section filter |

### mas-core-docs-mcp tools

- **`search_mas_core_docs`** — search MAS suite docs (e.g. `install`, `licensing`, `mongodb`, `operator`)
- **`read_mas_core_doc`** — read a page by href (e.g. `SSRHPA_cd/appsuite/overview/c_technical_overview.html`)
- **`get_mas_core_toc`** — browse TOC, optionally filtered by section (e.g. `Installing`, `Security`)

### mas-manage-docs-mcp tools

- **`search_mas_manage_docs`** — search Maximo Manage docs (e.g. `work order`, `asset`, `inventory`, `preventive maintenance`)
- **`read_mas_manage_doc`** — read a page by href (e.g. `SSLPL8_cd/com.ibm.mbs.doc/wotrack/c_wo_tracking_application.html`)
- **`get_mas_manage_toc`** — browse TOC, optionally filtered by section (e.g. `Work Orders`, `Assets`, `Inventory`)

---

## Quick Start (npx — no install required)

The fastest way to use these servers is via `npx`. No cloning, no build step — dependencies are resolved automatically on first run.

```bash
npx mas-core-docs-mcp
# or
npx mas-manage-docs-mcp
```

> Behind a corporate firewall? See [Using a Private / Local Nexus Registry](#using-a-private--local-nexus-registry).

---

## Configuration

Add one or both servers to your MCP client config. Using `npx -y` skips the install confirmation prompt.

### IBM Bob

Global config (`~/.bob/mcp_settings.json`) or project config (`.bob/mcp.json`):

```json
{
  "mcpServers": {
    "mas-core-docs": {
      "command": "npx",
      "args": ["-y", "mas-core-docs-mcp"],
      "alwaysAllow": ["search_mas_core_docs", "read_mas_core_doc", "get_mas_core_toc"]
    },
    "mas-manage-docs": {
      "command": "npx",
      "args": ["-y", "mas-manage-docs-mcp"],
      "alwaysAllow": ["search_mas_manage_docs", "read_mas_manage_doc", "get_mas_manage_toc"]
    }
  }
}
```

### Claude Code

**Option 1: CLI**

```bash
claude mcp add mas-core-docs -- npx -y mas-core-docs-mcp
claude mcp add mas-manage-docs -- npx -y mas-manage-docs-mcp
```

**Option 2: `.mcp.json`** (commit to repo for team sharing)

```json
{
  "mcpServers": {
    "mas-core-docs": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mas-core-docs-mcp"]
    },
    "mas-manage-docs": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mas-manage-docs-mcp"]
    }
  }
}
```

### Claude Desktop

`claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mas-core-docs": {
      "command": "npx",
      "args": ["-y", "mas-core-docs-mcp"]
    },
    "mas-manage-docs": {
      "command": "npx",
      "args": ["-y", "mas-manage-docs-mcp"]
    }
  }
}
```

> Add both entries to `mcpServers` to run both servers simultaneously.  
> `alwaysAllow` skips per-call approval prompts in IBM Bob.

---

## Building from Source

If you prefer to run from source rather than via `npx`:

```bash
cd mas-core-docs-mcp   # or mas-manage-docs-mcp
npm install
npm run build
node dist/index.js
```

Then reference the compiled file directly in your MCP config:

```json
{
  "command": "node",
  "args": ["/absolute/path/to/mas-core-docs-mcp/dist/index.js"]
}
```

---

## Publishing to npm

Each server is independently publishable. Build first, then publish:

```bash
cd mas-core-docs-mcp
npm install && npm run build
npm publish

cd ../mas-manage-docs-mcp
npm install && npm run build
npm publish
```

Authenticate with your npm token beforehand:

```bash
npm login
# or set token directly in ~/.npmrc:
# //registry.npmjs.org/:_authToken=<your-token>
```

---

## Tech Stack

- TypeScript + Node.js (`"type": "module"`, `module: "Node16"`)
- [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk) — MCP protocol implementation
- [`jsdom`](https://www.npmjs.com/package/jsdom) + [`turndown`](https://www.npmjs.com/package/turndown) — HTML → Markdown conversion
- IBM Docs API (`ibm.com/docs/api/v1`) — documentation search and retrieval

---

## License

MIT

---

## Using a Private / Local Nexus Registry

If your environment blocks the public npm registry, point `npm` at your internal Nexus proxy before running `npm install` or `npx`.

### Option 1 — Per-project `.npmrc` (recommended)

Create `.npmrc` inside the sub-project directory (e.g. `mas-core-docs-mcp/.npmrc`):

```ini
registry=https://nexus.example.com/repository/npm-proxy/
# If authentication is required:
//nexus.example.com/repository/npm-proxy/:_authToken=${NPM_TOKEN}
```

```bash
export NPM_TOKEN=<your-nexus-token>
cd mas-core-docs-mcp
npm install && npm run build
```

### Option 2 — Global npm config

```bash
npm config set registry https://nexus.example.com/repository/npm-proxy/
npm config set //nexus.example.com/repository/npm-proxy/:_authToken <your-nexus-token>

cd mas-core-docs-mcp
npm install && npm run build
```

Revert afterwards:

```bash
npm config set registry https://registry.npmjs.org/
```

### Option 3 — Single command override

```bash
cd mas-core-docs-mcp
npm install --registry https://nexus.example.com/repository/npm-proxy/
npm run build
```

> **Required packages:** `@modelcontextprotocol/sdk`, `jsdom`, `turndown`, `zod` (runtime) · `typescript`, `@types/jsdom`, `@types/turndown` (dev). Ensure all are available in your Nexus proxy before installing.
