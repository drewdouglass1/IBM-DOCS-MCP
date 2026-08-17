# Plan: Create mas-core-docs-mcp and mas-manage-docs-mcp

## Overview

Create two new MCP servers following the exact same pattern as the existing four servers in this monorepo. Each server is a self-contained TypeScript package under its own directory with identical source structure (`src/index.ts`, `src/ibm-docs-api.ts`, `src/utils.ts`) — only the product key, server name, tool name prefixes, and descriptions differ.

**Product keys confirmed from IBM Docs:**
- `mas-core-docs-mcp` → `SSRHPA_cd` (full Maximo Application Suite, continuous delivery)
- `mas-manage-docs-mcp` → `SSLPL8_cd` (Maximo Manage, continuous delivery)

Both use the same IBM Docs API base at `https://www.ibm.com/docs/api/v1`.

---

## Sub-Task 1: Create `mas-core-docs-mcp`

**Intent:** Scaffold a new MCP server for the full IBM Maximo Application Suite documentation by copying the `apic-docs-mcp` structure and substituting MAS-specific values.

**Expected Outcomes:**
- Directory `mas-core-docs-mcp/` exists at repo root
- `npm run build` compiles without errors from inside that directory
- Server name, tool names, descriptions, and product key all reference MAS Core

**Todo List:**
1. Create `mas-core-docs-mcp/package.json` — copy from `apic-docs-mcp/package.json`, set `name` to `mas-core-docs-mcp` and `description` to `"MCP server for IBM Maximo Application Suite (full suite) documentation"`
2. Create `mas-core-docs-mcp/tsconfig.json` — exact copy from `apic-docs-mcp/tsconfig.json` (no changes needed)
3. Create `mas-core-docs-mcp/.gitignore` — exact copy (`node_modules/`, `dist/`)
4. Create `mas-core-docs-mcp/src/ibm-docs-api.ts` — copy from `apic-docs-mcp/src/ibm-docs-api.ts`, change `PRODUCT_KEY` to `"SSRHPA_cd"`
5. Create `mas-core-docs-mcp/src/utils.ts` — exact copy from `apic-docs-mcp/src/utils.ts` (no changes needed)
6. Create `mas-core-docs-mcp/src/index.ts` — copy from `apic-docs-mcp/src/index.ts`, applying these substitutions:
   - Server name: `"apic-docs"` → `"mas-core-docs"`
   - Tool 1: `"search_apic_docs"` → `"search_mas_core_docs"`, update description to reference IBM Maximo Application Suite
   - Tool 2: `"read_apic_doc"` → `"read_mas_core_doc"`, update description and example href to use a MAS path (e.g. `SSRHPA_cd/appsuite/overview/c_technical_overview.html`)
   - Tool 3: `"get_apic_toc"` → `"get_mas_core_toc"`, update description to reference IBM Maximo Application Suite
   - `console.error` startup message: `"APIC Docs MCP server running on stdio"` → `"MAS Core Docs MCP server running on stdio"`
   - Remove Korean comments (replace with English equivalents: `// Tool 1: Search docs`, `// Tool 2: Read a doc page`, `// Tool 3: Get table of contents`)
7. Create `mas-core-docs-mcp/README.md` — English README documenting tools, setup (`npm install && npm run build`), and MCP client config snippets in this order: IBM Bob first, then Claude Code, then Claude Desktop

**Relevant Context:**
- Pattern source: [`apic-docs-mcp/src/index.ts`](apic-docs-mcp/src/index.ts), [`apic-docs-mcp/src/ibm-docs-api.ts`](apic-docs-mcp/src/ibm-docs-api.ts)
- Tool response shape requires `type: "text" as const` — do not omit `as const`
- Local imports must use `.js` extension (e.g. `"./ibm-docs-api.js"`)
- `console.error` only — never `console.log` (stdout is MCP protocol wire)

**Status:** [x] done

---

## Sub-Task 2: Create `mas-manage-docs-mcp`

**Intent:** Scaffold a new MCP server for IBM Maximo Manage documentation using the same pattern, with the Maximo Manage product key.

**Expected Outcomes:**
- Directory `mas-manage-docs-mcp/` exists at repo root
- `npm run build` compiles without errors from inside that directory
- Server name, tool names, descriptions, and product key all reference Maximo Manage

**Todo List:**
1. Create `mas-manage-docs-mcp/package.json` — copy from `apic-docs-mcp/package.json`, set `name` to `mas-manage-docs-mcp` and `description` to `"MCP server for IBM Maximo Manage documentation"`
2. Create `mas-manage-docs-mcp/tsconfig.json` — exact copy from `apic-docs-mcp/tsconfig.json`
3. Create `mas-manage-docs-mcp/.gitignore` — exact copy (`node_modules/`, `dist/`)
4. Create `mas-manage-docs-mcp/src/ibm-docs-api.ts` — copy from `apic-docs-mcp/src/ibm-docs-api.ts`, change `PRODUCT_KEY` to `"SSLPL8_cd"`
5. Create `mas-manage-docs-mcp/src/utils.ts` — exact copy from `apic-docs-mcp/src/utils.ts`
6. Create `mas-manage-docs-mcp/src/index.ts` — copy from `apic-docs-mcp/src/index.ts`, applying these substitutions:
   - Server name: `"apic-docs"` → `"mas-manage-docs"`
   - Tool 1: `"search_apic_docs"` → `"search_mas_manage_docs"`, update description to reference IBM Maximo Manage
   - Tool 2: `"read_apic_doc"` → `"read_mas_manage_doc"`, update description and example href to use a Manage path (e.g. `SSLPL8_cd/...`)
   - Tool 3: `"get_apic_toc"` → `"get_mas_manage_toc"`, update description to reference IBM Maximo Manage
   - `console.error` startup message → `"MAS Manage Docs MCP server running on stdio"`
   - Remove Korean comments, replace with English
7. Create `mas-manage-docs-mcp/README.md` — English README for Maximo Manage, same structure (Bob first, Claude Code, Claude Desktop)

**Relevant Context:**
- Product key `SSLPL8_cd` confirmed from `https://www.ibm.com/docs/en/maximo-manage/cd`
- Same constraints as Sub-Task 1 apply (`.js` imports, `as const`, `console.error`)

**Status:** [x] done

---

## Sub-Task 3: Update AGENTS.md

**Intent:** Update the root `AGENTS.md` and `.bob/rules-plan/AGENTS.md` to document the two new servers.

**Expected Outcomes:**
- `AGENTS.md` lists `mas-core-docs-mcp` and `mas-manage-docs-mcp` with their product keys

**Todo List:**
1. Add the two new servers to the structure table in [`AGENTS.md`](AGENTS.md)
2. Add the two new servers to the product key reference in [`.bob/rules-plan/AGENTS.md`](.bob/rules-plan/AGENTS.md)

**Status:** [x] done
