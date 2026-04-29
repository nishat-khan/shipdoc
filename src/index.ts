#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exportToNotion } from "./tools/export-notion.js";

const server = new McpServer({
  name: "shipdoc",
  version: "1.0.0",
});

server.tool(
  "export_to_notion",
  "Export a Cursor plan as a formatted PRD to a Notion page. Supports custom templates via a markdown file with {{name}}, {{overview}}, {{body}}, {{architecture}}, {{tasks}} placeholders.",
  {
    plan_path: z.string().describe("Absolute path to the .plan.md file"),
    parent_page_id: z
      .string()
      .describe("Notion page ID to create the document under"),
    title: z
      .string()
      .optional()
      .describe("Override the document title (defaults to plan name)"),
    template_path: z
      .string()
      .optional()
      .describe(
        "Path to a custom markdown template file. Use placeholders: {{name}}, {{overview}}, {{body}}, {{architecture}}, {{tasks}}. If omitted, uses the default PRD format.",
      ),
  },
  async ({ plan_path, parent_page_id, title, template_path }) => {
    try {
      const result = await exportToNotion({
        plan_path,
        parent_page_id,
        title,
        template_path,
      });
      return { content: [{ type: "text", text: result }] };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true,
      };
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ShipDoc MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
