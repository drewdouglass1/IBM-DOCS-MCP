# Plan Mode — Architecture Constraints

## Intentional duplication across sub-projects
The six servers share identical code except for `PRODUCT_KEY` and tool name prefixes. There is no abstraction layer by design — each server is meant to be deployed independently. Do not plan a shared library refactor without understanding this constraint.

**Product key registry:**
- `apic-docs-mcp` → `SSMNED_12.1.x_cd`
- `concert-docs-mcp` → `SSQNYH_2.3.x`
- `instana-docs-mcp` → `SSE1JP5_1.0.315`
- `iwhi-docs-mcp` → `SSQNUZ_4.7.x`
- `mas-core-docs-mcp` → `SSRHPA_cd` (full MAS suite, continuous delivery)
- `mas-manage-docs-mcp` → `SSLPL8_cd` (Maximo Manage, continuous delivery)

## IBM Docs API coupling
All business logic depends on the shape of `https://www.ibm.com/docs/api/v1`. Any plan that adds new tools or resources must account for what that API actually returns — the interfaces in `ibm-docs-api.ts` (`SearchResponse`, `TocResponse`, etc.) are the canonical schema.

## stdio transport is the only supported transport
`StdioServerTransport` is hardcoded. There is no HTTP/SSE mode. Plans involving remote or HTTP-based deployment require adding a second transport.

## No workspace tooling at root
There is no root `package.json`, no Turborepo, no Nx, no Lerna. Any cross-project automation (e.g. build-all script) must be added at the repo root from scratch.

## HTML→Markdown pipeline is fragile
`extractAndConvert()` in `utils.ts` relies on IBM Docs pages having a `main`, `article`, `.body`, or `body` element. Changes to IBM's page structure will silently degrade output quality — plan for defensive selectors if extending.
