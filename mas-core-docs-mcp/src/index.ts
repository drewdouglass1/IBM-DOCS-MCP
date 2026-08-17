#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchDocs, fetchToc, fetchDocContent, type TocItem } from "./ibm-docs-api.js";
import { extractAndConvert, stripHtmlTags } from "./utils.js";

const server = new McpServer({
  name: "mas-core-docs",
  version: "1.0.0",
  description: "IBM Maximo Application Suite (Core) documentation — covers platform-level topics including installation, upgrade, administration, licensing, AppPoints, backup and disaster recovery, security, OpenShift configuration, and suite-wide settings. This is the 'IBM Maximo Application Suite - component' doc set (SSRHPA_cd). For application-specific docs (Manage, Monitor, Health, etc.) use the dedicated application servers.",
});

// Tool 1: Search docs
server.tool(
  "search_mas_core_docs",
  "Search IBM Maximo Application Suite (Core) documentation covering platform-level topics: installation, upgrade, administration, licensing, AppPoints, backup/DR, security, OpenShift, and suite-wide configuration. Returns matching topics with titles, snippets, and hrefs. Use 'read_mas_core_doc' to retrieve full page content.",
  {
    query: z.string().describe("Search query (e.g. 'install', 'licensing', 'AppPoints', 'backup', 'disaster recovery', 'mongodb', 'operator', 'upgrade', 'security')"),
    start: z.number().optional().default(0).describe("Result offset for pagination"),
    limit: z.number().optional().default(10).describe("Number of results (max 20)"),
  },
  async ({ query, start, limit }) => {
    try {
      const result = await searchDocs(query, start, Math.min(limit, 20));
      const formatted = result.topics.map((t) => ({
        title: stripHtmlTags(t.title),
        url: t.fullurl,
        snippet: stripHtmlTags(t.snippet),
        href: t.href,
        date: t.date,
        readTime: `${t.readTime}min`,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                totalHits: result.hits,
                showing: `${start + 1}-${start + formatted.length}`,
                results: formatted,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `Search error: ${error}` }],
        isError: true,
      };
    }
  }
);

// Tool 2: Read a doc page
server.tool(
  "read_mas_core_doc",
  "Read a specific IBM Maximo Application Suite (Core) documentation page and return its full content as Markdown. Use the 'href' value from search results or the TOC. Covers platform topics: install, upgrade, admin, licensing, backup/DR, security, OpenShift, and suite configuration.",
  {
    href: z
      .string()
      .describe(
        "Document href path (e.g. 'SSRHPA_cd/appsuite/overview/c_technical_overview.html')"
      ),
  },
  async ({ href }) => {
    try {
      const html = await fetchDocContent(href);
      const markdown = extractAndConvert(html);
      return {
        content: [{ type: "text" as const, text: markdown }],
      };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `Read error: ${error}` }],
        isError: true,
      };
    }
  }
);

// Tool 3: Get table of contents
server.tool(
  "get_mas_core_toc",
  "Get the table of contents for IBM Maximo Application Suite (Core) documentation. Returns the full hierarchy of platform-level sections and topics including installation, upgrade, administration, licensing, AppPoints, backup/DR, security, and OpenShift configuration. Use the returned hrefs with 'read_mas_core_doc' to fetch page content.",
  {
    section: z
      .string()
      .optional()
      .describe("Optional: filter to a specific top-level section by label or topicId (e.g. 'Installing', 'Security', 'Licensing', 'Upgrading', 'Administering', 'Backup')"),
  },
  async ({ section }) => {
    try {
      const toc = await fetchToc();
      let topics = toc.toc.topics;

      if (section) {
        const lower = section.toLowerCase();
        const filtered = topics.filter(
          (t) =>
            t.label.toLowerCase().includes(lower) ||
            t.topicId.toLowerCase().includes(lower)
        );
        if (filtered.length > 0) {
          topics = filtered;
        }
      }

      function formatToc(items: TocItem[], depth = 0): string {
        return items
          .map((item) => {
            const indent = "  ".repeat(depth);
            let line = `${indent}- ${item.label}`;
            if (item.href) line += ` [${item.href}]`;
            if (item.topics && item.topics.length > 0) {
              line += "\n" + formatToc(item.topics, depth + 1);
            }
            return line;
          })
          .join("\n");
      }

      return {
        content: [
          {
            type: "text" as const,
            text: `# IBM Maximo Application Suite (Core) - Table of Contents\n\n${formatToc(topics)}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `TOC error: ${error}` }],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MAS Core Docs MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
