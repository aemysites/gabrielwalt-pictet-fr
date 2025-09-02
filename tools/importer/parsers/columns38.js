/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid wrapper
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Find the main grid (contains columns)
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;

  // Get all direct column children
  const columns = Array.from(grid.querySelectorAll(':scope > .acacias-GridColumn'));

  // Find the column with .acacias--hub-module-content-area
  const contentCol = columns.find(col => col.classList.contains('acacias--hub-module-content-area'));
  if (!contentCol) return;

  // Inside contentCol, find the two column layout
  const twoColItem = contentCol.querySelector('.acacias--comp-two-cols-static');
  if (!twoColItem) return;

  // Get the inner grid for the two columns
  const innerGrid = twoColItem.querySelector('.acacias--content-item-inner-wrapper.acacias-Grid');
  if (!innerGrid) return;

  // Get the two column containers
  const innerColumns = Array.from(innerGrid.querySelectorAll(':scope > .acacias-GridColumn'));

  // Only include columns that actually have content
  const contentCells = innerColumns
    .map(col => col.querySelector('.cmp-container'))
    .filter(cmpContainer => cmpContainer && cmpContainer.children.length > 0);

  // Table header row
  const headerRow = ['Columns (columns38)'];
  // Table content row (only columns with actual content)
  const tableRows = [headerRow, contentCells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
