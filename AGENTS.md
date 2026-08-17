# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Structure

Monorepo of four independent MCP servers, each in its own directory with its own `package.json`. There is no root-level build or workspace tooling — all commands must be run **inside each sub-project directory**:

- `apic-docs-mcp/` — IBM API Connect 12.1.0 (`PRODUCT_KEY = "SSMNED_12.1.x_cd"`)
- `concert-docs-mcp/` — IBM Concert (`PRODUCT_KEY = "SSQNYH_2.3.x"`)
- `instana-docs-mcp/` — IBM Instana (`PRODUCT_KEY = "SSE1JP5_1.0.315"`)
- `iwhi-docs-mcp/` — IBM Hybrid Integration (`PRODUCT_KEY = "SSQNUZ_4.7.x"`)
- `mas-core-docs-mcp/` — IBM Maximo Application Suite full suite (`PRODUCT_KEY = "SSRHPA_cd"`)
- `mas-manage-docs-mcp/` — IBM Maximo Manage (`PRODUCT_KEY = "SSLPL8_cd"`)

## Commands (run from inside a sub-project directory)

```bash
npm install      # install deps
npm run build    # tsc compile → dist/
npm start        # run compiled server (requires build first)
```

**No test runner, no lint script** — none exist in any package.json.

## Key Architecture

Each server is identical in structure (`src/index.ts`, `src/ibm-docs-api.ts`, `src/utils.ts`):

- `ibm-docs-api.ts` — fetches from `https://www.ibm.com/docs/api/v1` using a browser `User-Agent` header (required; the IBM Docs API rejects missing/bot agents). The only difference between servers is `PRODUCT_KEY`.
- `utils.ts` — converts HTML → Markdown using JSDOM + TurndownService with custom rules (tables, code, script/nav/footer stripping). Use `extractAndConvert()` for full HTML pages, `htmlToMarkdown()` for fragments, `stripHtmlTags()` for plain text.
- `index.ts` — registers three tools per server (`search_*`, `read_*`, `get_*_toc`) and starts a stdio MCP transport.

## Code Style

- TypeScript strict mode, `module: "Node16"`, `moduleResolution: "Node16"` — **local imports must use `.js` extension** (e.g. `import { ... } from "./ibm-docs-api.js"`)
- `"type": "module"` in package.json — ES module syntax throughout, no CommonJS
- Tool responses always return `{ content: [{ type: "text" as const, text: string }] }` — the `as const` on `"text"` is required for the SDK type
- Errors are caught per-tool and returned as `{ content: [...], isError: true }` — **never let tool handlers throw**
- `console.error` (not `console.log`) for server diagnostics — stdout is reserved for MCP protocol messages on stdio transport

## Adding a New Server

Copy any existing sub-project, change `PRODUCT_KEY` in `ibm-docs-api.ts`, rename tool identifiers in `index.ts`, and update `package.json` name/description. No shared packages exist; duplication is intentional.
