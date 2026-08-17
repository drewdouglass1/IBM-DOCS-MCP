# ibm-docs-mcp

> **Unofficial** — This is a community project and is not officially affiliated with IBM.

A collection of unofficial MCP (Model Context Protocol) servers for searching and reading IBM product documentation.

Compatible with AI clients that support MCP, including IBM Bob, Claude Code, and Claude Desktop.

## MCP Servers

| Server | Product | Topics | Tools |
|--------|---------|--------|-------|
| [apic-docs-mcp](./apic-docs-mcp) | IBM API Connect 12.1.0 | 1,000+ | `search_apic_docs`, `read_apic_doc`, `get_apic_toc` |
| [iwhi-docs-mcp](./iwhi-docs-mcp) | IBM Hybrid Integration Library | 700+ | `search_iwhi_docs`, `read_iwhi_doc`, `get_iwhi_toc` |
| [instana-docs-mcp](./instana-docs-mcp) | IBM Instana Observability | 760+ | `search_instana_docs`, `read_instana_doc`, `get_instana_toc` |
| [concert-docs-mcp](./concert-docs-mcp) | IBM Concert 2.3.x | 290+ | `search_concert_docs`, `read_concert_doc`, `get_concert_toc` |
| [mas-core-docs-mcp](./mas-core-docs-mcp) | IBM Maximo Application Suite (full suite) | 1,000+ | `search_mas_core_docs`, `read_mas_core_doc`, `get_mas_core_toc` |
| [mas-manage-docs-mcp](./mas-manage-docs-mcp) | IBM Maximo Manage | 1,000+ | `search_mas_manage_docs`, `read_mas_manage_doc`, `get_mas_manage_toc` |

Each server provides three tools:
- **search** — Search documentation by keyword (pagination supported)
- **read** — Read a specific documentation page and return it as Markdown
- **toc** — Browse the full table of contents (section filter supported)

## Quick Start

```bash
# Navigate to the server directory you want
cd apic-docs-mcp  # or iwhi-docs-mcp, instana-docs-mcp, concert-docs-mcp, mas-core-docs-mcp, mas-manage-docs-mcp

# Install and build
npm install
npm run build
```

See each server's `README.md` for full configuration details.

## Configuration

### IBM Bob

Add to your global config (`~/.bob/mcp_settings.json`) or project config (`.bob/mcp.json`):

```json
{
  "mcpServers": {
    "apic-docs": {
      "command": "node",
      "args": ["/absolute/path/to/apic-docs-mcp/dist/index.js"],
      "alwaysAllow": ["search_apic_docs", "read_apic_doc", "get_apic_toc"]
    }
  }
}
```

### Claude Code

**Option 1: CLI** (recommended)

```bash
claude mcp add apic-docs -- node /absolute/path/to/apic-docs-mcp/dist/index.js
```

**Option 2: `.mcp.json`** (place in project root for team sharing)

```json
{
  "mcpServers": {
    "apic-docs": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/apic-docs-mcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "apic-docs": {
      "command": "node",
      "args": ["/absolute/path/to/apic-docs-mcp/dist/index.js"]
    }
  }
}
```

> To use multiple servers simultaneously, add each one as a separate entry inside `mcpServers`.
> Setting `alwaysAllow` means tool calls won't require manual approval each time.

## Tech Stack

- TypeScript + Node.js
- `@modelcontextprotocol/sdk` — MCP protocol implementation
- `jsdom` + `turndown` — HTML to Markdown conversion
- IBM Docs API (`ibm.com/docs/api/v1`) — documentation search and retrieval

## License

MIT
