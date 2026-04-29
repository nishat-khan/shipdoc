#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exportToNotion } from "./tools/export-notion.js";
import { copyToClipboard } from "./tools/copy-clipboard.js";

const server = new McpServer({
  name: "shipdoc",
  version: "1.0.0",
});

server.tool(
  "export_to_notion",
  "Export a Cursor plan as a formatted PRD to a Notion page, with Mermaid diagrams rendered natively",
  {
    plan_path: z.string().describe("Absolute path to the .plan.md file"),
    parent_page_id: z
      .string()
      .describe("Notion page ID to create the document under"),
    title: z
      .string()
      .optional()
      .describe("Override the document title (defaults to plan name)"),
  },
  async ({ plan_path, parent_page_id, title }) => {
    try {
      const result = await exportToNotion({ plan_path, parent_page_id, title });
      return { content: [{ type: "text", text: result }] };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true,
      };
    }
  },
);

server.tool(
  "copy_plan_to_clipboard",
  "Copy a Cursor plan to the system clipboard as a formatted PRD or raw markdown",
  {
    plan_path: z.string().describe("Absolute path to the .plan.md file"),
    format: z
      .enum(["prd", "raw"])
      .default("prd")
      .describe("Export as formatted PRD or raw markdown"),
  },
  async ({ plan_path, format }) => {
    try {
      const result = await copyToClipboard({ plan_path, format });
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
