#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { searchDocs, fetchToc, fetchDocContent, type TocItem } from "./ibm-docs-api.js";
import { extractAndConvert, stripHtmlTags } from "./utils.js";

const server = new McpServer({
  name: "iwhi-docs",
  version: "1.0.0",
});

server.tool(
  "search_iwhi_docs",
  "Search IBM Hybrid Integration Library (IWHI) documentation. Returns matching topics with titles, snippets, and URLs.",
  {
    query: z.string().describe("Search query (e.g. 'DataStage', 'catalog', 'API')"),
    lang: z.enum(["ko", "en"]).optional().default("ko").describe("Language: 'ko' (Korean) or 'en' (English)"),
    start: z.number().optional().default(0).describe("Result offset for pagination"),
    limit: z.number().optional().default(10).describe("Number of results (max 20)"),
  },
  async ({ query, lang, start, limit }) => {
    try {
      const result = await searchDocs(query, lang, start, Math.min(limit, 20));
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

server.tool(
  "read_iwhi_doc",
  "Read a specific IWHI documentation page and return its content as Markdown. Use the 'href' from search results or TOC.",
  {
    href: z
      .string()
      .describe(
        "Document href path (e.g. 'SSQNUZ_4.7.x/cpd/overview/overview.html')"
      ),
    lang: z.enum(["ko", "en"]).optional().default("ko").describe("Language: 'ko' or 'en'"),
  },
  async ({ href, lang }) => {
    try {
      const html = await fetchDocContent(href, lang);
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

server.tool(
  "get_iwhi_toc",
  "Get the table of contents for IWHI documentation. Shows the full document structure with sections and topics.",
  {
    section: z
      .string()
      .optional()
      .describe("Optional: filter to a specific section by label (e.g. 'Installing', 'DataStage', 'Security')"),
    lang: z.enum(["ko", "en"]).optional().default("ko").describe("Language: 'ko' or 'en'"),
  },
  async ({ section, lang }) => {
    try {
      const toc = await fetchToc(lang);
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
            text: `# IBM Hybrid Integration Library - Table of Contents\n\n${formatToc(topics)}`,
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
  console.error("IWHI Docs MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
