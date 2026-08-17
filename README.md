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

## Configuration

These are published npm packages and can be loaded directly by your MCP client (such as IBM Bob, Claude Code, or Claude Desktop).

### IBM Bob

IBM Bob has built-in native support for managing and installing MCP servers through its interactive skills:

#### Option 1: Automatic Installation using Bob (Recommended)
You can ask Bob to configure the server automatically. Bob will verify your Node.js version, test-run the package, and configure your workspace or global settings for you.

Simply type:
```
please configure the mas-manage-docs-mcp server
```
or
```
please configure the mas-core-docs-mcp server
```

#### Option 2: Manual Configuration
If you prefer to configure manually, you can edit your settings files via the UI or by directly modifying your JSON configuration:

1. Click the **Settings** (gear) icon in the IBM Bob panel.
2. Select the **MCP** tab.
3. Choose the scope you want to configure:
   - Click **Edit Global MCP** to open `~/.bob/settings/mcp.json` (applies across all workspaces).
   - Click **Edit Project MCP** to open `.bob/mcp.json` in your current workspace (creates the file if it doesn't exist).
4. Add the configuration below inside the `mcpServers` object and save the file:

```json
{
  "mcpServers": {
    "mas-core-docs-mcp": {
      "command": "npx",
      "args": ["-y", "mas-core-docs-mcp"],
      "alwaysAllow": ["search_mas_core_docs", "read_mas_core_doc", "get_mas_core_toc"]
    },
    "mas-manage-docs-mcp": {
      "command": "npx",
      "args": ["-y", "mas-manage-docs-mcp"],
      "alwaysAllow": ["search_mas_manage_docs", "read_mas_manage_doc", "get_mas_manage_toc"]
    }
  }
}
```

> **Note**: Setting `"alwaysAllow"` bypasses individual tool execution permission prompts in IBM Bob.
* **Global Configuration (IDE)**: `~/.bob/settings/mcp.json`
* **Global Configuration (Bob Shell)**: `~/.bob/settings/mcp_settings.json`
* **Project-Level Configuration**: `.bob/mcp.json`

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
