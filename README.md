# ShipDoc

Ship design docs and PRDs from Cursor Plan mode to Notion — Mermaid diagrams included.

## What it does

ShipDoc is a Cursor plugin that exports your Plan mode documents as polished PRDs. It provides two tools:

- **`export_to_notion`** — Creates a formatted Notion page from your `.plan.md` file, with Mermaid diagrams rendered natively
- **`copy_plan_to_clipboard`** — Copies the formatted PRD to your system clipboard for pasting into any wiki, Slack, or doc tool

Just say "ship this doc" or "export this plan" in Cursor and the agent handles the rest.

## Setup

### 1. Install dependencies

```bash
cd server
npm install
npm run build
```

### 2. Configure Notion (optional, for Notion export)

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) and create an integration
2. Copy the API key
3. Share your target Notion page with the integration
4. Set the key in `mcp.json`:

```json
{
  "mcpServers": {
    "shipdoc": {
      "command": "node",
      "args": ["server/dist/index.js"],
      "env": {
        "NOTION_API_KEY": "ntn_your_key_here"
      }
    }
  }
}
```

### 3. Register the plugin locally

Copy or symlink the plugin directory:

```bash
mkdir -p ~/.cursor/plugins/local
ln -s $(pwd) ~/.cursor/plugins/local/shipdoc
```

Restart Cursor to load the plugin.

## Usage

In any Cursor chat:

- **"Export this plan to Notion"** — the agent reads your latest `.plan.md`, reformats it as a PRD, and creates a Notion page
- **"Copy this plan to clipboard"** — copies the formatted PRD to clipboard
- **"Ship this doc"** — the agent asks where you want it

## PRD Output Format

Plans are reformatted into a clean structure:

```
# Plan Name — Design Document

## Overview
(from plan frontmatter)

## Architecture
(mermaid diagrams)

## Detailed Design
(full plan body)

## Task Breakdown
- [ ] task 1
- [x] task 2 (completed)

## Open Questions
```

## Development

```bash
cd server
npm install
npm run dev          # watch mode
npm run inspect      # test with MCP Inspector
```

## License

MIT
