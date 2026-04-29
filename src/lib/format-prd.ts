import { readFile } from "node:fs/promises";
import type { ParsedPlan } from "./parse-plan.js";

function extractDetailedDesign(body: string): string {
  let cleaned = body.trim();
  cleaned = cleaned.replace(/^#\s+.+\n*/, "");
  return cleaned.trim();
}

function buildPlaceholders(plan: ParsedPlan): Record<string, string> {
  const architecture =
    plan.mermaidBlocks.length > 0
      ? plan.mermaidBlocks
          .map((block) => "```mermaid\n" + block + "\n```")
          .join("\n\n")
      : "";

  const tasks =
    plan.todos.length > 0
      ? plan.todos
          .map((t) => {
            const check = t.status === "completed" ? "x" : " ";
            return `- [${check}] ${t.content}`;
          })
          .join("\n")
      : "";

  return {
    name: plan.name,
    overview: plan.overview,
    body: extractDetailedDesign(plan.body),
    architecture,
    tasks,
  };
}

export async function formatWithTemplate(
  plan: ParsedPlan,
  templatePath: string,
): Promise<string> {
  const template = await readFile(templatePath, "utf-8");
  const placeholders = buildPlaceholders(plan);

  return template.replace(
    /\{\{(\w+)\}\}/g,
    (match, key) => placeholders[key] ?? match,
  );
}

export function formatPrd(plan: ParsedPlan): string {
  const sections: string[] = [];

  sections.push(`# ${plan.name} — Design Document\n`);
  sections.push(`## Overview\n\n${plan.overview}\n`);

  if (plan.mermaidBlocks.length > 0) {
    const diagrams = plan.mermaidBlocks
      .map((block) => "```mermaid\n" + block + "\n```")
      .join("\n\n");
    sections.push(`## Architecture\n\n${diagrams}\n`);
  }

  const detail = extractDetailedDesign(plan.body);
  if (detail) {
    sections.push(`## Detailed Design\n\n${detail}\n`);
  }

  if (plan.todos.length > 0) {
    const items = plan.todos
      .map((t) => {
        const check = t.status === "completed" ? "x" : " ";
        return `- [${check}] ${t.content}`;
      })
      .join("\n");
    sections.push(`## Task Breakdown\n\n${items}\n`);
  }

  sections.push(`## Open Questions\n\n_None yet — add questions here._\n`);

  return sections.join("\n");
}
