# ShipDoc

Ship design docs and PRDs from Cursor Plan mode to Notion — Mermaid diagrams included.

## What it does

ShipDoc is an MCP server that exports your Cursor Plan mode documents as polished PRDs to Notion. It supports custom templates — bring your team's doc format and ShipDoc fills in the plan data.

Just say "ship this doc" or "export this plan to Notion" in Cursor and the agent handles the rest.

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

### Notion setup

The Notion API is free — no paid plan required.

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) and create an integration
2. Copy the API key and paste it into the `NOTION_API_KEY` field above
3. Share your target Notion page with the integration

## Usage

In any Cursor chat:

- **"Export this plan to Notion"** — uses the default PRD format
- **"Export this plan to Notion using my template at .cursor/prd-template.md"** — uses your custom template
- **"Ship this doc"** — the agent asks for details

## Custom Templates

Create a markdown file with placeholders and ShipDoc fills them from your plan:

```markdown
# {{name}} — RFC

## Context
{{overview}}

## System Diagrams
{{architecture}}

## Technical Design
{{body}}

## Milestones
{{tasks}}

## Risks & Mitigations
_TBD_
```

**Available placeholders:**

| Placeholder | Filled with |
|---|---|
| `{{name}}` | Plan name from frontmatter |
| `{{overview}}` | Overview from frontmatter |
| `{{body}}` | Full plan body (minus title) |
| `{{architecture}}` | Mermaid diagrams |
| `{{tasks}}` | Formatted task checklist |

You can export a Notion page as markdown, replace the dynamic parts with placeholders, and use it as your template.

## Development

```bash
npm install
npm run dev          # watch mode
npm run inspect      # test with MCP Inspector
```

## License

MIT
