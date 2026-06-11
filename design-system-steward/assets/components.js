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
