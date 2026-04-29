import { Client } from "@notionhq/client";
import { parsePlan } from "../lib/parse-plan.js";
import { formatPrd, formatWithTemplate } from "../lib/format-prd.js";

export interface ExportNotionInput {
  plan_path: string;
  parent_page_id: string;
  title?: string;
  template_path?: string;
}

export async function exportToNotion(
  input: ExportNotionInput,
): Promise<string> {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error(
      "NOTION_API_KEY is not set. Create a Notion integration at " +
        "https://www.notion.so/my-integrations and set the key in mcp.json env.",
    );
  }

  const notion = new Client({ auth: apiKey });
  const plan = await parsePlan(input.plan_path);
  const prdMarkdown = input.template_path
    ? await formatWithTemplate(plan, input.template_path)
    : formatPrd(plan);
  const title = input.title ?? plan.name;

  const response = await notion.pages.create({
    parent: { page_id: input.parent_page_id },
    properties: {
      title: {
        title: [{ text: { content: title } }],
      },
    },
    children: markdownToNotionBlocks(prdMarkdown),
  } as any);

  const pageId = (response as any).id;
  const url =
    (response as any).url ??
    `https://www.notion.so/${pageId.replace(/-/g, "")}`;

  return `Created Notion page: ${url}`;
}

/**
 * Converts markdown content into Notion block objects.
 * Handles headings, code blocks (including mermaid), lists, and paragraphs.
 */
function markdownToNotionBlocks(markdown: string): any[] {
  const blocks: any[] = [];
  const lines = markdown.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      const language = line.slice(3).trim() || "plain text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({
        object: "block",
        type: "code",
        code: {
          language: language === "mermaid" ? "mermaid" : language,
          rich_text: [{ type: "text", text: { content: codeLines.join("\n") } }],
        },
      });
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      blocks.push({
        object: "block",
        type: "heading_1",
        heading_1: {
          rich_text: [{ type: "text", text: { content: line.slice(2).trim() } }],
        },
      });
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: line.slice(3).trim() } }],
        },
      });
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      blocks.push({
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [{ type: "text", text: { content: line.slice(4).trim() } }],
        },
      });
      i++;
      continue;
    }

    // Checklist item
    if (/^- \[([ x])\] /.test(line)) {
      const checked = line[3] === "x";
      const text = line.replace(/^- \[[ x]\] /, "");
      blocks.push({
        object: "block",
        type: "to_do",
        to_do: {
          checked,
          rich_text: [{ type: "text", text: { content: text } }],
        },
      });
      i++;
      continue;
    }

    // Bullet list item
    if (line.startsWith("- ")) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: line.slice(2) } }],
        },
      });
      i++;
      continue;
    }

    // Empty line — skip
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph (collect contiguous non-empty lines)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("- ")
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            { type: "text", text: { content: paraLines.join("\n") } },
          ],
        },
      });
    }
  }

  return blocks;
}
