/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid wrapper for the columns
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Find the grid containing the columns
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;

  // Get all direct column children (should be 3: title, address, description)
  const columns = Array.from(grid.children).filter(col => col.classList.contains('acacias-GridColumn'));

  // For each column, get all its content (not just cmp-title/cmp-text)
  const cells = columns.map(col => {
    // If column has cmp-title or cmp-text, use that, else use all children
    const cmpTitle = col.querySelector('.cmp-title');
    const cmpText = col.querySelector('.cmp-text');
    if (cmpTitle) return cmpTitle;
    if (cmpText) return cmpText;
    // If no cmp-title/cmp-text, include all children or the column itself
    if (col.children.length > 0) {
      return Array.from(col.children);
    }
    return col;
  }).filter(cell => {
    // Only keep cells with non-empty text content
    if (Array.isArray(cell)) {
      return cell.some(child => child.textContent && child.textContent.trim());
    }
    return cell.textContent && cell.textContent.trim();
  });

  // Must have at least 2 columns
  if (cells.length < 2) return;

  // Build the table rows
  const headerRow = ['Columns (columns46)'];
  const contentRow = cells;

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
