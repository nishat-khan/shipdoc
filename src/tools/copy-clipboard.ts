import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { platform } from "node:os";
import { parsePlan } from "../lib/parse-plan.js";
import { formatPrd } from "../lib/format-prd.js";

const execFileAsync = promisify(execFile);

export interface CopyClipboardInput {
  plan_path: string;
  format: "prd" | "raw";
}

export async function copyToClipboard(
  input: CopyClipboardInput,
): Promise<string> {
  const plan = await parsePlan(input.plan_path);
  const content = input.format === "prd" ? formatPrd(plan) : plan.body;

  const os = platform();
  let cmd: string;
  let args: string[];

  if (os === "darwin") {
    cmd = "pbcopy";
    args = [];
  } else if (os === "linux") {
    cmd = "xclip";
    args = ["-selection", "clipboard"];
  } else if (os === "win32") {
    cmd = "clip";
    args = [];
  } else {
    throw new Error(`Unsupported platform: ${os}`);
  }

  const child = execFileAsync(cmd, args, { encoding: "utf-8" });
  child.child.stdin?.write(content);
  child.child.stdin?.end();
  await child;

  const label = input.format === "prd" ? "formatted PRD" : "raw markdown";
  return `Copied ${label} to clipboard (${content.length} chars, plan: "${plan.name}")`;
}
