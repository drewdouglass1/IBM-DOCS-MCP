# apic-docs-mcp

> **Unofficial** — This is a community project and is not officially affiliated with IBM.

An unofficial MCP (Model Context Protocol) server for searching and reading IBM API Connect 12.1.0 official documentation.

Compatible with AI clients that support MCP, including IBM Bob, Claude Code, and Claude Desktop.

## Tools

| Tool | Description |
|------|-------------|
| `search_apic_docs` | Search by keyword (1,000+ topics, pagination supported) |
| `read_apic_doc` | Read a specific documentation page and return it as Markdown |
| `get_apic_toc` | Browse the full table of contents (section filter supported) |

## Setup

```bash
git clone https://github.com/drewdouglass1/IBM-DOCS-MCP.git
cd apic-docs-mcp
npm install
npm run build
```

## MCP Client Configuration

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

> Setting `alwaysAllow` means tool calls won't require manual approval each time.

## Usage Examples

```
"How do I configure OAuth in API Connect?"
"Find documentation about gateway endpoints"
"Show me the installation table of contents"
```

## Tech Stack

- TypeScript + Node.js
- `@modelcontextprotocol/sdk` — MCP protocol implementation
- `jsdom` + `turndown` — HTML to Markdown conversion
- IBM Docs API (`ibm.com/docs/api/v1`) — documentation search and retrieval

## License

MIT
