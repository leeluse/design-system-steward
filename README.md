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
- Keeping UI specs explicit: colors, size, spacing, route, status, phases, and component usage.
- Updating existing screens/components without losing the accumulated archive.
- Modeling loading, empty, error, success, and other inspectable route states as workspace phases.

## Install

```bash
npx skills add https://github.com/leeluse/design-system-steward --skill design-system-steward
```

## Repository structure

```txt
design-system-steward/
  SKILL.md
  assets/
    components.js
    design-system-steward-preview.html
```

`components.js` is the primary working file. It contains both workspace and component registrations. `design-system-steward-preview.html` is a self-contained preview shell and should only be changed when shell behavior itself needs to change, such as phase navigation, visible metadata, or rendering rules.

Workspaces use a fixed 1440x900 desktop frame by default, scaled by the preview shell to fit the viewport. Mobile or responsive variants should be modeled intentionally in the archive.

## Stewardship rules

- **Start from the real project.** Before designing, inspect relevant app routes, components, assets, design specs, CSS, and tokens. Reuse existing colors, typography, spacing, radii, and component patterns instead of inventing a new direction.
- **Search narrowly.** Use `rg` for route names, workspace IDs, component classes, token names, and spec titles. Read only relevant blocks first. Prefer sources in this order: live app route/component -> design spec HTML/CSS -> existing archive workspace/component -> screenshot/assets -> inferred mockup.
- **Preserve spec fidelity.** When moving an existing design spec HTML into the archive, keep the original layout structure, class roles, copy, state indicators, and visual proportions unless the user explicitly asks for simplification.
- **Treat workspaces as static mockups.** Archive workspaces are fixed-frame design records, not responsive app implementations. Add responsive behavior only when requested, and model it intentionally as variants, phases, states, or CSS media/container rules.
- **Edit the shell only for shell behavior.** Ordinary screen and component additions go into `components.js`. Modify `design-system-steward-preview.html` only when archive behavior needs to change, such as phase navigation, visible metadata, routing, or rendering rules.
- **Protect encoding.** Prefer `apply_patch` for Korean or other non-ASCII text, avoid uncontrolled PowerShell rewrites, verify UTF-8 after scripted edits, scan for mojibake/replacement characters, and run `node --check` for touched JavaScript files.

## Workspace phases

Use `phases` when one route has separately inspectable states such as loading, skeleton, empty, error, or success. Do not model the same view as both `phase` and `state`.

```js
Archive.add({
  type: "workspace",
  id: "ws-generation-view",
  name: "Generation View",
  route: "/generation-view",
  status: "draft",
  uses: [],
  phases: [
    {
      id: "loading",
      name: "Loading",
      route: "/generation-view/loading",
      html: `<div>...</div>`,
      css: `.phase-specific-class { ... }`,
      spec: {
        colors: {},
        size: { phase: "loading" },
        spacing: {}
      },
      note: "..."
    }
  ],
  css: `...`,
  html: `...`,
  spec: { colors: {}, size: {}, spacing: {} }
});
```

When a workspace has phases, the left Workspace list should show the parent as expandable and allow each phase to be selected. Selecting a phase renders that phase's `html` and optional `css` while keeping it part of the parent workspace. The right spec panel should show the selected phase and route, or list available phases when the parent is selected.

## Positioning

This is not a Stitch MCP screen-generation skill. It is a UI archive and stewardship skill: it helps an agent preserve, inspect, extend, and maintain a project-specific interface system over time.

## Typical requests

- "Design a dashboard screen"
- "Add a settings screen workspace"
- "Extract this button into a component"
- "Create a card component matching the existing UI theme"
- "Show the current archive list"
