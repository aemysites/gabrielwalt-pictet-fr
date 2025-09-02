/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the grid wrapper (main content area)
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Get all top-level grid columns
  const gridColumns = gridWrapper.querySelectorAll(':scope > .acacias-Grid > .acacias-GridColumn');
  if (!gridColumns || gridColumns.length < 3) return;

  // Column 1: Title (left column)
  let titleCol = gridColumns[0];
  let titleEl = titleCol.querySelector('.cmp-title__text');
  // Defensive: fallback if not found
  if (!titleEl) {
    titleEl = titleCol;
  }

  // Column 2: Spacer (empty, ignore)
  // Column 3: Main content (right column)
  let contentCol = gridColumns[2];
  // Get all content items (lead text, image)
  const contentItems = contentCol.querySelectorAll(':scope > .cmp-container > .acacias--content-item');
  const rightColContent = [];
  contentItems.forEach((item) => {
    rightColContent.push(item);
  });

  // Table header
  const headerRow = ['Columns (columns42)'];
  // Table content row: left and right columns
  const contentRow = [titleEl, rightColContent];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
