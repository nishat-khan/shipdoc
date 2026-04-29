# ShipDoc

Ship design docs and PRDs from Cursor Plan mode to Notion — Mermaid diagrams included.

## What it does

ShipDoc is an MCP server that exports your Cursor Plan mode documents as polished PRDs. It provides two tools:

- **`export_to_notion`** — Creates a formatted Notion page from your `.plan.md` file, with Mermaid diagrams rendered natively
- **`copy_plan_to_clipboard`** — Copies the formatted PRD to your system clipboard for pasting into any wiki, Slack, or doc tool

Just say "ship this doc" or "export this plan" in Cursor and the agent handles the rest.

## Install

Add to your `.cursor/mcp.json` (project-level) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "shipdoc": {
      "command": "npx",
      "args": ["-y", "https://github.com/nishat-khan/shipdoc.git"],
      "env": {
        "NOTION_API_KEY": "your-key-here"
      }
    }
  }
}
```

Restart Cursor (or toggle the server in Settings > MCP). That's it — no npm account or manual cloning needed.

### Notion setup (optional, for `export_to_notion`)

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) and create an integration
2. Copy the API key and paste it into the `NOTION_API_KEY` field above
3. Share your target Notion page with the integration

If you only need clipboard export, you can omit the `env` block entirely.

## Usage

In any Cursor chat:

- **"Export this plan to Notion"** — the agent reads your `.plan.md`, reformats it as a PRD, and creates a Notion page
- **"Copy this plan to clipboard"** — copies the formatted PRD to clipboard
- **"Ship this doc"** — the agent asks where you want it

## PRD Output Format

Plans are reformatted into a clean structure:

```
# Plan Name — Design Document

## Overview
(from plan frontmatter)

## Architecture
(mermaid diagrams pulled to the top)

## Detailed Design
(full plan body)

## Task Breakdown
- [ ] task 1
- [x] task 2 (completed)

## Open Questions
```

## Development

```bash
npm install
npm run dev          # watch mode
npm run inspect      # test with MCP Inspector
```

## License

MIT
