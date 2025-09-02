/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children by selector
  function getImmediateChild(parent, selector) {
    return Array.from(parent.children).find(el => el.matches(selector));
  }

  // 1. Find the left column: the title
  let leftCol = null;
  let rightCol = null;

  // The structure is: .acacias--row > .acacias--grid-wrapper > .acacias-Grid > [columns...]
  const gridWrapper = getImmediateChild(element, '.acacias--grid-wrapper');
  if (gridWrapper) {
    const grid = getImmediateChild(gridWrapper, '.acacias-Grid');
    if (grid) {
      const gridCols = Array.from(grid.children).filter(child => child.classList.contains('acacias-GridColumn'));
      // Defensive: leftCol is the first with .acacias--hub-module-left-col, rightCol is the one with .acacias--hub-module-content-area
      leftCol = gridCols.find(col => col.classList.contains('acacias--hub-module-left-col'));
      rightCol = gridCols.find(col => col.classList.contains('acacias--hub-module-content-area'));
    }
  }

  // 2. Get the left content: the h2 title
  let leftContent = null;
  if (leftCol) {
    // Find the .cmp-title__text h2
    const h2 = leftCol.querySelector('.cmp-title__text');
    if (h2) {
      leftContent = h2;
    }
  }

  // 3. Get the right content: the text block
  let rightContent = null;
  if (rightCol) {
    // Find the .cmp-text
    const cmpText = rightCol.querySelector('.cmp-text');
    if (cmpText) {
      rightContent = cmpText;
    }
  }

  // 4. Build the table rows
  const headerRow = ['Columns (columns6)'];
  const contentRow = [leftContent, rightContent];

  // 5. Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // 6. Replace the original element
  element.replaceWith(table);
}
