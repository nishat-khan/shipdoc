import type { ParsedPlan } from "./parse-plan.js";

/**
 * Strips the YAML-frontmatter-derived sections that we'll re-emit in a
 * structured PRD layout, keeping only the "meat" of the plan body.
 */
function extractDetailedDesign(body: string): string {
  let cleaned = body.trim();

  // Remove the first H1 if present (we replace it with our own)
  cleaned = cleaned.replace(/^#\s+.+\n*/, "");

  return cleaned.trim();
}

export function formatPrd(plan: ParsedPlan): string {
  const sections: string[] = [];

  // Title
  sections.push(`# ${plan.name} — Design Document\n`);

  // Overview
  sections.push(`## Overview\n\n${plan.overview}\n`);

  // Architecture (mermaid diagrams pulled to the top)
  if (plan.mermaidBlocks.length > 0) {
    const diagrams = plan.mermaidBlocks
      .map((block) => "```mermaid\n" + block + "\n```")
      .join("\n\n");
    sections.push(`## Architecture\n\n${diagrams}\n`);
  }

  // Detailed Design (the full body, minus the title we already used)
  const detail = extractDetailedDesign(plan.body);
  if (detail) {
    sections.push(`## Detailed Design\n\n${detail}\n`);
  }

  // Task Breakdown
  if (plan.todos.length > 0) {
    const items = plan.todos
      .map((t) => {
        const check = t.status === "completed" ? "x" : " ";
        return `- [${check}] ${t.content}`;
      })
      .join("\n");
    sections.push(`## Task Breakdown\n\n${items}\n`);
  }

  // Open Questions placeholder
  sections.push(`## Open Questions\n\n_None yet — add questions here._\n`);

  return sections.join("\n");
}
