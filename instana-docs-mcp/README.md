# instana-docs-mcp

> **Unofficial** — This is a community project and is not officially affiliated with IBM.

An unofficial MCP (Model Context Protocol) server for searching and reading IBM Instana Observability official documentation.

## Tools

| Tool | Description |
|------|-------------|
| `search_instana_docs` | Search by keyword (760+ topics, pagination supported) |
| `read_instana_doc` | Read a specific documentation page and return it as Markdown |
| `get_instana_toc` | Browse the full table of contents (section filter supported) |

## Setup

```bash
git clone https://github.com/drewdouglass1/IBM-DOCS-MCP.git
cd instana-docs-mcp
npm install
npm run build
```

## MCP Client Configuration

### IBM Bob

Add to your global config (`~/.bob/mcp_settings.json`) or project config (`.bob/mcp.json`):

```json
{
  "mcpServers": {
    "instana-docs": {
      "command": "node",
      "args": ["/absolute/path/to/instana-docs-mcp/dist/index.js"],
      "alwaysAllow": ["search_instana_docs", "read_instana_doc", "get_instana_toc"]
    }
  }
}
```

### Claude Code

**Option 1: CLI** (recommended)

```bash
claude mcp add instana-docs -- node /absolute/path/to/instana-docs-mcp/dist/index.js
```

**Option 2: `.mcp.json`** (place in project root for team sharing)

```json
{
  "mcpServers": {
    "instana-docs": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/instana-docs-mcp/dist/index.js"]
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "instana-docs": {
      "command": "node",
      "args": ["/absolute/path/to/instana-docs-mcp/dist/index.js"]
    }
  }
}
```

> Setting `alwaysAllow` means tool calls won't require manual approval each time.

## Usage Examples

```
"How do I configure Kubernetes monitoring in Instana?"
"Find documentation about alerting"
"Show me the installation table of contents"
```

## Tech Stack

- TypeScript + Node.js
- `@modelcontextprotocol/sdk` — MCP protocol implementation
- `jsdom` + `turndown` — HTML to Markdown conversion
- IBM Docs API (`ibm.com/docs/api/v1`) — documentation search and retrieval

## License

MIT
