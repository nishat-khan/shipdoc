# ShipDoc — Export Plan Skill

## When to activate

Activate this skill when the user says any of:
- "export this plan"
- "ship this doc"
- "send to Notion"
- "copy plan to clipboard"
- "export PRD"
- "shipdoc"

## What to do

### 1. Find the plan file

Look for `.plan.md` files in the workspace's `.cursor/plans/` directory. If there are multiple plans, ask the user which one to export. If there is exactly one, use it. Use the absolute path.

### 2. Ask where to export

Present two options:
- **Notion** — creates a formatted page with Mermaid diagrams rendered natively
- **Clipboard** — copies formatted PRD markdown to system clipboard for pasting into any wiki, Slack, or doc tool

### 3a. Export to Notion

If the user chooses Notion:
1. Ask for the parent Notion page ID (or use a previously configured default). Explain that the user can find this in the page URL: `notion.so/<workspace>/<page-title>-<PAGE_ID>`.
2. Optionally ask if they want to override the title.
3. Call the `export_to_notion` tool with `plan_path`, `parent_page_id`, and optional `title`.
4. Report the resulting Notion page URL to the user.

### 3b. Copy to clipboard

If the user chooses clipboard:
1. Ask whether they want **PRD format** (structured design document) or **raw** (original plan markdown).
2. Call the `copy_plan_to_clipboard` tool with `plan_path` and `format`.
3. Confirm success and tell them to paste wherever they need it.

## Important notes

- The `NOTION_API_KEY` must be configured in the plugin's `mcp.json` env. If the Notion export fails with an auth error, guide the user to https://www.notion.so/my-integrations to create an integration and share the target page with it.
- Mermaid diagrams in the plan are preserved and render natively in Notion.
- The PRD format adds structure: Overview, Architecture, Detailed Design, Task Breakdown, and Open Questions sections.
