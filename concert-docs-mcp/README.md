# concert-docs-mcp

> **Unofficial** — This is a community project and is not officially affiliated with IBM.

An unofficial MCP (Model Context Protocol) server for searching and reading IBM Concert official documentation.

## Tools

| Tool | Description |
|------|-------------|
| `search_concert_docs` | Search by keyword (290+ topics, pagination supported) |
| `read_concert_doc` | Read a specific documentation page and return it as Markdown |
| `get_concert_toc` | Browse the full table of contents (section filter supported) |

## Setup

```bash
git clone https://github.com/drewdouglass1/IBM-DOCS-MCP.git
cd concert-docs-mcp
npm install
npm run build
```

## MCP Client Configuration

### IBM Bob

Add to your global config (`~/.bob/mcp_settings.json`) or project config (`.bob/mcp.json`):

```json
{
  "mcpServers": {
    "concert-docs": {
      "command": "node",
      "args": ["/absolute/path/to/concert-docs-mcp/dist/index.js"],
      "alwaysAllow": ["search_concert_docs", "read_concert_doc", "get_concert_toc"]
    }
  }
}
```

### Claude Code

**Option 1: CLI** (recommended)

```bash
claude mcp add concert-docs -- node /absolute/path/to/concert-docs-mcp/dist/index.js
```

**Option 2: `.mcp.json`** (place in project root for team sharing)

```json
{
  "mcpServers": {
    "concert-docs": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/concert-docs-mcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "concert-docs": {
      "command": "node",
      "args": ["/absolute/path/to/concert-docs-mcp/dist/index.js"]
    }
  }
}
```

> Setting `alwaysAllow` means tool calls won't require manual approval each time.

## Usage Examples

```
"How do I update an application definition in Concert?"
"Find documentation about inventory management"
"Show me the installation table of contents"
```

## Tech Stack

- TypeScript + Node.js
- `@modelcontextprotocol/sdk` — MCP protocol implementation
- `jsdom` + `turndown` — HTML to Markdown conversion
- IBM Docs API (`ibm.com/docs/api/v1`) — documentation search and retrieval

## License

MIT
