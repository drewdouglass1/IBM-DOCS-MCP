# Ask Mode — Documentation Context

## Product keys are version-specific
When answering questions about which product a server covers, reference `PRODUCT_KEY` in `ibm-docs-api.ts` — it encodes both product code and version (e.g. `SSMNED_12.1.x_cd` = API Connect 12.1.x).

## IBM Docs API is undocumented
The API at `https://www.ibm.com/docs/api/v1` is unofficial/internal. Endpoints:
- `GET /search?query=...&lang=en&start=N&limit=N&products=PRODUCT_KEY`
- `GET /toc/PRODUCT_KEY?lang=en`
- `GET /content/HREF?parsebody=true&lang=en` (returns raw HTML, not JSON)

## READMEs are in Korean
All four README.md files are written in Korean. They document setup, tool names, and MCP client config snippets for Bob, Claude Code, and Claude Desktop.

## No tests exist
There is no test framework, no test files, and no lint tooling in any sub-project. Validation is build-only (`tsc`).
