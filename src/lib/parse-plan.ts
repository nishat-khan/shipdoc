import { readFile } from "node:fs/promises";
import matter from "gray-matter";

export interface PlanTodo {
  id: string;
  content: string;
  status: string;
}

export interface ParsedPlan {
  name: string;
  overview: string;
  todos: PlanTodo[];
  body: string;
  mermaidBlocks: string[];
}

const MERMAID_REGEX = /```mermaid\n([\s\S]*?)```/g;

export async function parsePlan(planPath: string): Promise<ParsedPlan> {
  const raw = await readFile(planPath, "utf-8");
  const { data, content } = matter(raw);

  const mermaidBlocks: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = MERMAID_REGEX.exec(content)) !== null) {
    mermaidBlocks.push(match[1].trim());
  }

  return {
    name: data.name ?? "Untitled Plan",
    overview: data.overview ?? "",
    todos: Array.isArray(data.todos) ? data.todos : [],
    body: content,
    mermaidBlocks,
  };
}
