/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getImmediateChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Get the left column (title)
  let leftCol = null;
  let rightCol = null;
  const gridWrapper = getImmediateChildByClass(element, 'acacias--grid-wrapper');
  if (gridWrapper) {
    const grid = getImmediateChildByClass(gridWrapper, 'acacias-Grid');
    if (grid) {
      const gridColumns = Array.from(grid.children).filter(child => child.classList.contains('acacias-GridColumn'));
      // The first column is the left (title), the third is the right (content)
      leftCol = gridColumns[0];
      rightCol = gridColumns[2];
    }
  }

  // Defensive fallback: if not found, try to find by class
  if (!leftCol) {
    leftCol = element.querySelector('.acacias--hub-module-left-col');
  }
  if (!rightCol) {
    rightCol = element.querySelector('.acacias--hub-module-content-area');
  }

  // 2. Compose the table cells
  const headerRow = ['Columns (columns41)'];

  // Left cell: title (h2)
  let leftCell = leftCol;
  // Right cell: all content (lead text, numbers, footnote)
  let rightCell = rightCol;

  // Defensive: if leftCol or rightCol is missing, use empty div
  if (!leftCell) {
    leftCell = document.createElement('div');
  }
  if (!rightCell) {
    rightCell = document.createElement('div');
  }

  const contentRow = [leftCell, rightCell];

  // 3. Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 4. Replace the original element
  element.replaceWith(block);
}
