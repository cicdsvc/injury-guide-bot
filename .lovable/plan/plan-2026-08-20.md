Hide the "What would you like to do?" section and the 3 option tiles below it on the home page while keeping the code available to re-enable later.

## Plan

1. In `src/routes/index.tsx`, add a boolean toggle (e.g., `const SHOW_OPTIONS = false`) at the top of the component and wrap the heading + tile grid in a conditional render so the section is hidden when the toggle is false.
2. Leave the `options` array and tile markup untouched so the section can be restored quickly by changing the toggle to `true`.
3. Verify the home page renders correctly without the hidden section (no broken imports, no orphaned `options` array causing issues).

## Why this approach
- The user explicitly wants to keep the section available, not delete it. A toggle is the cleanest way to hide while preserving the code.
- The hidden section is purely presentational; no data, state, or route changes are required.
