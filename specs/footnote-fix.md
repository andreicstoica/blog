# Footnote-as-Tooltip Agent Spec

## Problem
I currently have footnotes rendered on my .mdx blog pages. However, instead of navigating to the bottom and back up, I want the footnotes to appear as tooltip-style hover items. Delete any navigation logic in my file that is deemed unnecessary.

## Description
1. Hides the rendered footnote list on the screen (kept for screen readers and print).
2. Adds a hover/click tooltip to every footnote reference (`<sup><a href="#fn1">1</a></sup>`).
3. Pulls the tooltip text from the matching footnote item (`<li id="fn1">…</li>`), allowing you to edit content in **one** place.
4. Works even in SPA frameworks because it operates entirely client-side.

**Questions for you (please answer or adjust the snippet):**
0. **Think of the best way to implement this feature.** Should it be custom, or should we augment the shadcn tooltip component? If so, let me know to install it for you.
1. **Trigger** – hover on desktop, click on touch devices
2. **Tooltip theme** – match the system theme
3. **Max width** – The tooltip wraps at `20em` by default. Since I have long footnotes, consider making them scrollable after a certain width or height.

## Success Criteria

| ID | Criterion | Test Method |
|---|---|---|
| SC-1 | Footnote list is visually hidden but present in the DOM | Inspect HTML; print preview shows the list |
| SC-2 | Hover/click on reference shows tooltip with correct text | Manual test on desktop and mobile |
| SC-3 | Tooltip auto-positions above or below to stay in the viewport | Resize window |
| SC-4 | ESC key or outside click dismisses tooltip | Keyboard test |
| SC-5 | No CLS (layout shift) when tooltips appear | Lighthouse audit |
