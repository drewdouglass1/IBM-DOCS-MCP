# iwhi-docs-mcp

> **Unofficial** — This is a community project and is not officially affiliated with IBM.

An unofficial MCP (Model Context Protocol) server for searching and reading IBM Hybrid Integration Library (IWHI) official documentation. Supports both Korean and English documentation.

## Tools

| Tool | Description |
|------|-------------|
| `search_iwhi_docs` | Search by keyword (700+ topics, pagination supported) |
| `read_iwhi_doc` | Read a specific documentation page and return it as Markdown |
| `get_iwhi_toc` | Browse the full table of contents (section filter supported) |

## Setup

```bash
git clone https://github.com/drewdouglass1/IBM-DOCS-MCP.git
cd iwhi-docs-mcp
npm install
npm run build
```

## MCP Client Configuration

### IBM Bob

Add to your global config (`~/.bob/mcp_settings.json`) or project config (`.bob/mcp.json`):

```json
{
  "mcpServers": {
    "iwhi-docs": {
      "command": "node",
      "args": ["/absolute/path/to/iwhi-docs-mcp/dist/index.js"],
      "alwaysAllow": ["search_iwhi_docs", "read_iwhi_doc", "get_iwhi_toc"]
    }
  }
}
```

### Claude Code

**Option 1: CLI** (recommended)

```bash
claude mcp add iwhi-docs -- node /absolute/path/to/iwhi-docs-mcp/dist/index.js
```

**Option 2: `.mcp.json`** (place in project root for team sharing)

```json
{
  "mcpServers": {
    "iwhi-docs": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/iwhi-docs-mcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "iwhi-docs": {
      "command": "node",
      "args": ["/absolute/path/to/iwhi-docs-mcp/dist/index.js"]
    }
  }
}
```

> Setting `alwaysAllow` means tool calls won't require manual approval each time.

## Usage Examples

```
"Find documentation about DataStage"
"How do I manage catalogs in IWHI?"
"Show me the installation table of contents"
```

## Tech Stack

- TypeScript + Node.js
- `@modelcontextprotocol/sdk` — MCP protocol implementation
- `jsdom` + `turndown` — HTML to Markdown conversion
- IBM Docs API (`ibm.com/docs/api/v1`) — documentation search and retrieval

## License

MIT
