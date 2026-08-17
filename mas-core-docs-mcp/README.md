# mas-core-docs-mcp

> **Unofficial** — This is a community project and is not officially affiliated with IBM.

An unofficial MCP (Model Context Protocol) server for searching and reading the IBM Maximo Application Suite documentation. Covers the full suite: installation, administration, licensing, all application overviews, Suite License Service, and more.

## Tools

| Tool | Description |
|------|-------------|
| `search_mas_core_docs` | Search by keyword across all MAS documentation (1,000+ topics, pagination supported) |
| `read_mas_core_doc` | Read a specific documentation page and return it as Markdown |
| `get_mas_core_toc` | Browse the full table of contents (section filter supported) |

## Setup

```bash
cd mas-core-docs-mcp
npm install
npm run build
```

## MCP Client Configuration

### IBM Bob

Add to your global config (`~/.bob/mcp_settings.json`) or project config (`.bob/mcp.json`):

```json
{
  "mcpServers": {
    "mas-core-docs": {
      "command": "node",
      "args": ["/absolute/path/to/mas-core-docs-mcp/dist/index.js"],
      "alwaysAllow": ["search_mas_core_docs", "read_mas_core_doc", "get_mas_core_toc"]
    }
  }
}
```

### Claude Code

**Option 1: CLI** (recommended)

```bash
claude mcp add mas-core-docs -- node /absolute/path/to/mas-core-docs-mcp/dist/index.js
```

**Option 2: `.mcp.json`** (place in project root for team sharing)

```json
{
  "mcpServers": {
    "mas-core-docs": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/mas-core-docs-mcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mas-core-docs": {
      "command": "node",
      "args": ["/absolute/path/to/mas-core-docs-mcp/dist/index.js"]
    }
  }
}
```

> Setting `alwaysAllow` means tool calls won't require manual approval each time.

## Usage Examples

```
"How do I install Maximo Application Suite on AWS?"
"What are the system requirements for MAS 9.2?"
"Show me the licensing documentation for MAS"
"How do I configure MongoDB for MAS?"
"What's new in Maximo Application Suite 9.2?"
```

## Tech Stack

- TypeScript + Node.js
- `@modelcontextprotocol/sdk` — MCP protocol implementation
- `jsdom` + `turndown` — HTML to Markdown conversion
- IBM Docs API (`ibm.com/docs/api/v1`) — documentation search and retrieval

## License

MIT
