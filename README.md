# Design System Steward

[English](README.md) | [한국어](README.ko.md)

A smart design system steward for maintaining a living project UI archive.

`design-system-steward` helps an agent design, organize, and evolve project UI work over time. It keeps two connected spaces:

- **Workspaces**: full screens or pages, such as `/dashboard`, `/settings`, or `/billing`.
- **Components**: reusable UI parts, such as buttons, inputs, cards, panels, and empty states.

Instead of treating each screen as a one-off design, Design System Steward keeps every workspace and component registered in `components.js`, so the project gradually develops a reusable interface memory.

## What it is good at

- Designing a full screen before splitting it into smaller UI parts.
- Reusing existing colors, spacing, radii, typography, and component patterns.
- Maintaining a left-panel list, center preview canvas, and right-side spec panel.
- Keeping UI specs explicit: colors, size, spacing, route, status, and component usage.
- Updating existing screens/components without losing the accumulated archive.

## Install

```bash
npx skills add https://github.com/leeluse/ui-steward --skill design-system-steward
```

## Repository structure

```txt
design-system-steward/
  SKILL.md
  assets/
    archive.html
    archive.css
    archive.js
    components.js
```

## Positioning

This is not a Stitch MCP screen-generation skill. It is a UI archive and stewardship skill: it helps an agent preserve, inspect, extend, and maintain a project-specific interface system over time.

## Typical requests

- "Design a dashboard screen"
- "Add a settings screen workspace"
- "Extract this button into a component"
- "Create a card component matching the existing UI theme"
- "Show the current archive list"
