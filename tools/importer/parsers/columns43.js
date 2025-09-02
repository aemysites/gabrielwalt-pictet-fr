/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first .acacias--row (main content row)
  const mainRow = element.querySelector('.acacias--row');
  if (!mainRow) return;

  // Find columns in this row
  const columns = Array.from(mainRow.querySelectorAll(':scope > .acacias--grid-wrapper > .acacias-Grid > .acacias-GridColumn'));
  if (!columns.length) return;

  // We'll build up the cells for the columns block (left, center, right)
  const cells = [];

  // Left column: author info
  const leftCol = columns[0];
  if (leftCol) {
    // Get the full left column content (not just .authortag)
    const leftContent = leftCol.cloneNode(true);
    cells.push(leftContent);
  }

  // Center column: main article content
  const centerCol = columns[1];
  if (centerCol) {
    // Get the full center column content
    const centerContent = centerCol.cloneNode(true);
    cells.push(centerContent);
  }

  // Right column: ad/info box
  const rightCol = columns[2];
  if (rightCol) {
    // Get the full right column content
    const rightContent = rightCol.cloneNode(true);
    cells.push(rightContent);
  }

  // Only proceed if at least one cell has content
  if (!cells.length) return;

  // Table header: must be exactly one column
  const headerRow = ['Columns (columns43)'];

  const tableRows = [headerRow, cells];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
