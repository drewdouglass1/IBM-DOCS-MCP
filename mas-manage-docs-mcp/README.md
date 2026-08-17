# mas-manage-docs-mcp

> **Unofficial** — This is a community project and is not officially affiliated with IBM.

An unofficial MCP (Model Context Protocol) server for searching and reading the IBM Maximo Manage documentation. Covers work orders, assets, inventory, preventive maintenance, purchasing, and all other Maximo Manage modules.

## Tools

| Tool | Description |
|------|-------------|
| `search_mas_manage_docs` | Search by keyword across all Maximo Manage documentation (pagination supported) |
| `read_mas_manage_doc` | Read a specific documentation page and return it as Markdown |
| `get_mas_manage_toc` | Browse the full table of contents (section filter supported) |

## Setup

```bash
cd mas-manage-docs-mcp
npm install
npm run build
```

## MCP Client Configuration

### IBM Bob

Add to your global config (`~/.bob/mcp_settings.json`) or project config (`.bob/mcp.json`):

```json
{
  "mcpServers": {
    "mas-manage-docs": {
      "command": "node",
      "args": ["/absolute/path/to/mas-manage-docs-mcp/dist/index.js"],
      "alwaysAllow": ["search_mas_manage_docs", "read_mas_manage_doc", "get_mas_manage_toc"]
    }
  }
}
```

### Claude Code

**Option 1: CLI** (recommended)

```bash
claude mcp add mas-manage-docs -- node /absolute/path/to/mas-manage-docs-mcp/dist/index.js
```

**Option 2: `.mcp.json`** (place in project root for team sharing)

```json
{
  "mcpServers": {
    "mas-manage-docs": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/mas-manage-docs-mcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mas-manage-docs": {
      "command": "node",
      "args": ["/absolute/path/to/mas-manage-docs-mcp/dist/index.js"]
    }
  }
}
```

> Setting `alwaysAllow` means tool calls won't require manual approval each time.

## Usage Examples

```
"How do I create a work order in Maximo Manage?"
"What are the work order statuses in Maximo Manage?"
"How does preventive maintenance work?"
"Explain how to configure inventory storerooms"
"How do I set up job plans?"
```

## Tech Stack

- TypeScript + Node.js
- `@modelcontextprotocol/sdk` — MCP protocol implementation
- `jsdom` + `turndown` — HTML to Markdown conversion
- IBM Docs API (`ibm.com/docs/api/v1`) — documentation search and retrieval

## License

MIT
