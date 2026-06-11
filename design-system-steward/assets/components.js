/* ============================================================
   components.js — Design System Steward registry
   ★ All component additions, modifications, and deletions are done ONLY in this file ★

   Harness Rules:
   1. 1 Component = 1 Archive.add({...}) block
   2. Required fields: id, name, category, status, css, html
   3. Spec keys must be grouped into exactly three categories: colors, size, and spacing.
      (Though auto-extracted if omitted, specifying intended values explicitly is recommended)
   4. CSS class names must be prefixed with the component id (to prevent collisions)
   ============================================================ */

Archive.add({
  id: "btn-primary",
  name: "Primary Button",
  category: "Button",
  status: "draft", // draft | ready
  css: `
    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center;
      height: 36px; padding: 0 16px;
      background: #2563EB; color: #FFFFFF;
      font-size: 14px; font-weight: 500;
      border: none; border-radius: 6px; cursor: pointer;
    }
    .btn-primary:hover { background: #1D4ED8; }
  `,
  html: `<button class="btn-primary">Button</button>`,
  spec: {
    colors: { background: "#2563EB", text: "#FFFFFF", hover: "#1D4ED8" },
    size: { height: "36px", radius: "6px", font: "14px / 500" },
    spacing: { padding: "0 16px", margin: "0" }
  },
  note: "For primary actions. Max 1 per screen rule."
});

Archive.add({
  type: "workspace",
  id: "ws-dashboard",
  name: "Sample Dashboard",
  route: "/dashboard",
  status: "draft",
  uses: ["btn-primary"],
  css: `
    .ws-dashboard-root {
      padding: 40px;
      background: #f3f4f6;
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
      justify-content: center;
      height: 640px;
    }
    body.dark .ws-dashboard-root {
      background: #1f2937;
    }
    .ws-title {
      font-size: 24px;
      font-weight: bold;
      color: #111827;
      margin: 0;
    }
    body.dark .ws-title {
      color: #f3f4f6;
    }
    .ws-desc {
      font-size: 14px;
      color: #4b5563;
      margin: 0;
      text-align: center;
    }
    body.dark .ws-desc {
      color: #9ca3af;
    }
  `,
  html: `
    <div class="ws-dashboard-root">
      <h2 class="ws-title">Design System Workspace</h2>
      <p class="ws-desc">This is a live preview of a workspace. You can use the zoom controls in the header to scale this frame.</p>
      <button class="btn-primary">Dashboard Action</button>
    </div>
  `,
  spec: {
    colors: { background: "#f3f4f6", title: "#111827", text: "#4b5563" },
    size: { frame: "1080px", height: "640px" },
    spacing: { padding: "40px", gap: "20px" }
  },
  note: "A sample workspace showing scaling and assembly."
});
