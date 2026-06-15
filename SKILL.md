---
name: design-system-steward
description: Act as a smart design system steward that designs, organizes, and maintains a living project UI archive with two spaces — Workspaces for full screens and Components for reusable UI parts. Use this skill when the user asks to design a feature, screen, page, workspace, or UI component, or when they want to set up or extend a project UI archive. Feature and screen requests must start from the Workspace; component requests go into the Component space. Everything is registered into components.js so the interface system accumulates over time.
---

# Design System Steward

A living archive for designing and maintaining project UI. It consists of two spaces:

- **Workspace**: A specific screen or page (e.g., `/dashboard`). The overall layout of a feature.
- **Component**: Smaller reusable parts within a workspace (buttons, inputs, cards, etc.).

Displays a list of Workspaces/Components on the left panel, a preview in the center (workspaces are scaled to fit within a 1440x900 frame), and specifications on the right panel (Colors / Sizes / Spacing + Route / Uses for Workspaces).

## File Structure (2 bundled files)

```
/design-system-steward
  components.js                        ← ★ The ONLY active working file. Both workspaces and components are defined here.
  design-system-steward-preview.html   ← Self-contained preview shell with inline HTML/CSS/JS. Modify only for shell behavior.
```

Both files exist in the bundled `assets/` directory. Copy them as-is when starting a new project. If an existing archive exists, append to its `components.js` and regenerate or update the preview HTML so it contains the latest registry.

## ★ Request Classification — Where to Start Designing (Highest Priority Rule)

When you receive a user request, classify it first:

**A. Feature/Screen Request** ("Design the notification feature", "Create a dashboard", "Add payment flow") →

1. Check if the relevant workspace already exists in `components.js`.
2. **If it does not exist, design the workspace first.** Defining the overall screen layout is always the first priority.
3. **If it exists,** design the smaller components required within that workspace, register them, and update the workspace's `uses` array and HTML.

**B. Specific Component Request** ("Create a button", "Design an input field") →
Register directly in the Component space. If the workspace where it will be used is clear, link them using the `workspace` field.

## ★ Existing Design Consistency (Mandatory Step Before Designing)

Before starting a design, **identify and reuse the existing project design first**:

- If the project already has UI implementation files, design specs, screenshots, app assets, or an existing archive, use them as the source of truth. Do not invent a new visual direction.
- Search narrowly first: inspect relevant routes/components/assets/spec files for the requested screen, then read nearby CSS/tokens. Do not bulk-read the whole project.
- Collect and reuse existing **colors** (primary, text, border, background series) from the real app or existing specs. Only introduce a new color if it cannot be expressed with the existing palette, and mention this to the user.
- Match existing **font sizes/weights, heights, border-radii, and spacing units** (e.g., if existing buttons have `height: 36px` / `radius: 6px`, follow the same system for new components).
- If the archive is empty and the user has not provided a brand guide, ask once about basic color/font preferences before starting.

## Fast Execution and Context Budget Rules

Use the smallest amount of context that can produce a faithful archive entry:

- Start with targeted searches using `rg`: route names, workspace names, component class names, token names, and source spec titles.
- Read only the relevant blocks around matches. Avoid opening full large HTML/CSS/JS files unless no narrower source exists.
- Prefer existing source artifacts in this order: live app route/component -> design spec HTML/CSS -> existing archive workspace/component -> screenshot/assets -> inferred mockup.
- If the requested screen already exists in the app or spec, translate that design into the archive instead of redesigning it.
- If a request says "add this screen", first determine whether it is a route-level workspace, an expandable phase, or a reusable component. Do not create extra categories.
- Before editing, state the target file(s) and why. For ordinary archive additions, edit `components.js` only.
- After editing, verify only what changed: `node --check` for touched JS files, targeted `rg` for expected IDs/routes/phases, and a corrupted-text scan when non-ASCII text was touched.

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
    size:    { "frame": "1440x900", "sidebar width": "220px" },
    spacing: { "content padding": "24px", "card gap": "16px" }
  },
  note: "..."
});
```

Workspace Rules:

1. **The engine automatically injects the CSS of components listed in `uses`.** Simply use the registered component classes (`btn-primary`, etc.) in the workspace HTML to assemble the page. Do not copy-paste component styles into the workspace CSS.
2. Components listed in `uses` must be registered in the archive. If a new component is needed, **register the component first** before using it in a workspace.
3. Desktop frame size is 1440x900 by default (if it is a mobile screen, verify with the user, set to 375x812 or the requested mobile size, and specify it in `spec.size.frame`).
4. Workspace CSS should only contain the layout (grid, area placement) and elements unique to that screen.

## Workspace Phase and State Rules

Use this model when a routed screen has loading, skeleton, empty, error, success, or other separately inspectable views:

- **Workspace = route-level screen.** A workspace represents one actual routed screen, such as `/dashboard` or `/generation-view`.
- **Phase = selectable state inside the same route.** In the archive, do not keep a separate `states` list for the same thing. If the user needs to click and inspect it, represent it as a `phase`.
- Use state names directly as phase IDs where possible: `loading`, `skeleton-reveal`, `empty`, `error`, `success`.
- Do not model the same view twice as both `phase` and `state`.
- If the archive engine does not visibly render a new metadata field, do not assume adding the field to `components.js` is enough. Also expose it in the workspace UI, `spec`, or update the archive shell when the user asks for visible behavior.

Phase format:

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
      css: `.phase-specific-class { ... }`, // optional
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

Phase UI rule:

- When a workspace has multiple phases, the left Workspace list should show the parent workspace as expandable and let the user select each phase below it.
- Selecting a phase should render that phase's `html` and optional `css`, while still treating it as part of the parent workspace.
- The right spec panel should show the selected phase and route, or list the available phases when the parent workspace is selected.

## Spec Extraction and Fidelity Rules

When moving screens from an existing design spec HTML into the archive:

- Do not replace the original screen with a simplified new mockup unless the user explicitly asks for simplification.
- Preserve the original layout structure, class roles, text, state indicators, and visual proportions as much as possible.
- If the original spec contains separate phase screens, move each phase into the parent workspace's `phases` array using the original phase HTML/CSS.
- Keep the design spec document as reference material unless the user asks to remove or rewrite it. Do not register the spec document itself as a workspace unless the user explicitly wants a documentation workspace.

## Static Frame and Responsiveness Rules

- Archive workspaces are previewed in a fixed 1440x900 desktop frame by default. The shell scales the frame to fit the viewport; it does not make the internal layout responsive.
- Treat archive workspace dimensions as static design mockups unless the user explicitly requests responsive variants.
- If responsive behavior is required, define it intentionally as variants, phases, states, or CSS media/container rules and document it in `spec.size`.

## Engine Modification Exception

`components.js` remains the default and primary working file. However, if the user asks for archive behavior that the current shell does not support, such as expandable workspace phases, visible metadata, navigation behavior, or rendering rules:

- First state that the behavior requires updating the shell inside `design-system-steward-preview.html`.
- Keep shell edits minimal and generic so future workspaces can reuse the behavior.
- Do not modify the shell HTML/CSS/JS inside `design-system-steward-preview.html` for ordinary screen/component additions.

## Encoding Safety Rules

The archive often contains Korean text and other non-ASCII UI copy. Preserve encoding carefully:

- Prefer `apply_patch` for edits involving Korean text.
- Do not rewrite an entire Korean-containing file with PowerShell `Set-Content` unless encoding is explicitly controlled and verified.
- If a scripted edit is necessary, read and write UTF-8 deliberately and verify afterward.
- After editing, run a quick corrupted-text scan for common mojibake/replacement-character patterns in touched files. Include the Unicode replacement character and known Korean mojibake fragments used in the project.
- Also run `node --check` for modified JavaScript registry or engine files.

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

The left side 2-section list (Workspaces → Components by category) & search, workspace 1440x900 frame rendering with auto-scaling to fit the window, automatic component CSS injection for `uses`, right-side specification panel (color swatches, Route, and interactive Uses links to jump to components), auto-extraction for missing specs, status indicators, and Alt-hover measurement tooltips.

## Deliverables Delivery

- Deliver both the folder (or zip) + **a single file for chat preview** (`design-system-steward-preview.html`, a self-contained HTML file with inline shell CSS/JS and registry data).
- Even if only adding or modifying part of the code, deliver the entire `components.js` file (including all existing registrations) — accumulation is key.
- If you design a new workspace, summarize the components that were extracted and registered separately in your response.
