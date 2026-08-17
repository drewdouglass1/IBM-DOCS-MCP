# Agent Mode — Coding Rules

## Critical: ES Module + Node16 import paths
All local imports **must** include the `.js` extension even though source files are `.ts`:
```ts
import { searchDocs } from "./ibm-docs-api.js";  // correct
import { searchDocs } from "./ibm-docs-api";       // will fail at runtime
```

## MCP tool response shape is required exactly
Every tool handler must return this shape — the SDK's types enforce it:
```ts
return {
  content: [{ type: "text" as const, text: "..." }],
};
// On error:
return {
  content: [{ type: "text" as const, text: `Error: ${error}` }],
  isError: true,
};
```
`as const` on the string literal `"text"` is mandatory — without it TypeScript rejects the type.

## stdout is MCP protocol — never write to it
Use `console.error(...)` for all logging. Any `console.log` to stdout will corrupt the MCP stdio framing.

## No shared packages
Each sub-project is fully self-contained. If you fix a bug in `utils.ts` or `ibm-docs-api.ts` for one server, you must manually replicate it to the other three — there is no shared library.

## Build before running
`dist/` is gitignored and not pre-built. Always run `npm run build` inside the sub-project directory before `npm start` or testing locally.
