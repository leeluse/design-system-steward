---
name: design-system-steward
description: Act as a smart design system steward that designs, organizes, and maintains a living project UI archive with two spaces — Workspaces for full screens and Components for reusable UI parts. Use this skill when the user asks to design a feature, screen, page, workspace, or UI component, or when they want to set up or extend a project UI archive. Feature and screen requests must start from the Workspace; component requests go into the Component space. Everything is registered into components.js so the interface system accumulates over time.
---

# Design System Steward

A living archive for designing and maintaining project UI. It consists of two spaces:

- **Workspace**: A specific screen or page (e.g., `/dashboard`). The overall layout of a feature.
- **Component**: Smaller reusable parts within a workspace (buttons, inputs, cards, etc.).

Displays a list of Workspaces/Components on the left panel, a preview in the center (workspaces are scaled to fit within a 1080px frame), and specifications on the right panel (Colors / Sizes / Spacing + Route / Uses for Workspaces).

## File Structure (Only 4 files)

```
/design-system-steward
  archive.html    ← App shell. DO NOT modify.
  archive.css     ← App styling. DO NOT modify.
  archive.js      ← Engine. DO NOT modify.
  components.js   ← ★ The ONLY active working file. Both workspaces and components are defined here.
```

All 4 files exist in the bundled `assets/` directory. Copy them as-is when starting a new project. If an existing archive exists, append to its `components.js`.

## ★ Request Classification — Where to Start Designing (Highest Priority Rule)

When you receive a user request, classify it first:

**A. Feature/Screen Request** ("Design the notification feature", "Create a dashboard", "Add payment flow") →
1. Check if the relevant workspace already exists in `components.js`.
2. **If it does not exist, design the workspace first.** Defining the overall screen layout is always the first priority.
3. **If it exists,** design the smaller components required within that workspace, register them, and update the workspace's `uses` array and HTML.

**B. Specific Component Request** ("Create a button", "Design an input field") →
Register directly in the Component space. If the workspace where it will be used is clear, link them using the `workspace` field.

## ★ Existing Design Consistency (Mandatory Step Before Designing)

Before starting a design, **always scan all existing registrations in `components.js`**:

- Collect and reuse existing **colors** (primary, text, border, background series) used in existing specs. Only introduce a new color if it cannot be expressed with the existing palette, and mention this to the user.
- Match existing **font sizes/weights, heights, border-radii, and spacing units** (e.g., if existing buttons have `height: 36px` / `radius: 6px`, follow the same system for new components).
- If the archive is empty and the user has not provided a brand guide, ask once about basic color/font preferences before starting.

## Workspace Registration Format

```js
Archive.add({
  type: "workspace",
  id: "ws-dashboard",          // 'ws-' prefix
  name: "Dashboard",
  route: "/dashboard",         // Symbolic screen route
  status: "draft",             // draft | ready
  uses: ["btn-primary", "input-text"],  // List of component IDs used in assembly
  css: `
    .ws-dashboard-root { ... } // Class name matches ID prefix. Only define layouts / page-specific areas here.
  `,
  html: `<div class="ws-dashboard-root"> ... <button class="btn-primary">Button</button> ... </div>`,
  spec: {
    colors:  { background: "#F8F9FB", "sidebar": "#FFFFFF" },
    size:    { "frame": "1080px", "sidebar width": "220px" },
    spacing: { "content padding": "24px", "card gap": "16px" }
  },
  note: "..."
});
```

Workspace Rules:
1. **The engine automatically injects the CSS of components listed in `uses`.** Simply use the registered component classes (`btn-primary`, etc.) in the workspace HTML to assemble the page. Do not copy-paste component styles into the workspace CSS.
2. Components listed in `uses` must be registered in the archive. If a new component is needed, **register the component first** before using it in a workspace.
3. Frame width is 1080px by default (if it is a mobile screen, verify with the user, set to 375px, and specify in `spec.size.frame`).
4. Workspace CSS should only contain the layout (grid, area placement) and elements unique to that screen.

## Component Registration Format

```js
Archive.add({
  type: "component",           // Optional (default value)
  id: "btn-danger",
  name: "Danger Button",
  category: "Button",          // Grouping criteria in the list
  workspace: "ws-dashboard",   // Optional: link to main workspace usage
  status: "draft",
  css: `.btn-danger { ... }`,  // Class name matches ID prefix
  html: `<button class="btn-danger">Delete</button>`,
  spec: {
    colors:  { background: "#DC2626", text: "#FFFFFF", hover: "#B91C1C" },
    size:    { height: "36px", radius: "6px", font: "14px / 500" },
    spacing: { padding: "0 16px", margin: "0" }
  },
  note: "..."                  // Optional
});
```

Component Rules:
1. **Keep spec keys grouped into exactly three categories: `colors`, `size`, and `spacing`.** Even though they can be auto-extracted if omitted, always specify intended values explicitly.
2. The CSS class name should match the ID prefix (since all components coexist on a single page).
3. The HTML should showcase one representative style/variant. Different variants should be registered as separate components within the same category.
4. Interaction states like hover should be implemented in both the CSS and documented in `spec.colors`.

## Management Operations

- "Modify X" → Modify the relevant block and reset the status to `draft`. When modifying a component, verify if it affects workspaces using it (in `uses`) and notify the user.
- "Delete X" → Remove the block. If it is used in any workspace's `uses`, issue a warning and clean it up as well.
- "Approve/Finalize X" → Set `status: "ready"`.
- "Show list" → Summarize Workspaces/Components in a table with columns: name, route, category, status.

## Auto-Handled by the Engine (DO NOT implement yourself)

The left side 2-section list (Workspaces → Components by category) & search, workspace 1080px frame rendering with auto-scaling to fit the window, automatic component CSS injection for `uses`, right-side specification panel (color swatches, Route, and interactive Uses links to jump to components), auto-extraction for missing specs, status indicators, and Alt-hover measurement tooltips.

## Deliverables Delivery

- Deliver both the folder (or zip) + **a single file for chat preview** (`archive-preview.html` with inline css/js of the 3 asset files).
- Even if only adding or modifying part of the code, deliver the entire `components.js` file (including all existing registrations) — accumulation is key.
- If you design a new workspace, summarize the components that were extracted and registered separately in your response.
