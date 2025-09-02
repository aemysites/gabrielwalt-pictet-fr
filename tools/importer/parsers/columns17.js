/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all top-level rows (blocks)
  const rows = Array.from(element.querySelectorAll(':scope > div > div > div'));
  const headerRow = ['Columns (columns17)'];
  const tableRows = [];

  rows.forEach((row) => {
    if (!row.classList.contains('acacias--row')) return;
    const gridWrapper = row.querySelector('.acacias--grid-wrapper');
    if (!gridWrapper) return;
    const grid = gridWrapper.querySelector('.acacias-Grid');
    if (!grid) return;
    const columns = Array.from(grid.querySelectorAll(':scope > .acacias-GridColumn'));
    // Only keep columns that have visible content (not just whitespace)
    const contentColumns = columns.filter(col => {
      // Accept forms
      if (col.querySelector('form')) return true;
      // Accept non-empty text
      if (col.textContent.trim()) return true;
      // Accept images
      if (col.querySelector('img')) return true;
      // Accept non-empty containers
      if (col.querySelector('.cmp-container') && col.querySelector('.cmp-container').textContent.trim()) return true;
      // Accept headers
      if (col.querySelector('.acacias--hub-module-title')) return true;
      return false;
    });
    // For each column, collect its full content block
    const cells = contentColumns.map((col) => {
      // For forms, keep the whole form
      const form = col.querySelector('form');
      if (form) return form;
      // For sticky headers, keep the header
      const header = col.querySelector('.acacias--hub-module-title');
      if (header) return header;
      // For content areas, keep all children (not just .acacias--content-area, but all direct children)
      const cmpContainer = col.querySelector('.cmp-container');
      if (cmpContainer) {
        // If the container has only one child, use it directly
        if (cmpContainer.children.length === 1) {
          return cmpContainer.children[0];
        }
        // Otherwise, return all children as array
        return Array.from(cmpContainer.children);
      }
      // Otherwise, use the column itself
      return col;
    });
    // Only add row if there is at least one non-empty cell
    if (cells.length) tableRows.push(cells);
  });

  // Create the table block
  const blockTable = WebImporter.DOMUtils.createTable([
    headerRow,
    ...tableRows
  ], document);

  // Replace the original element
  element.replaceWith(blockTable);
}
