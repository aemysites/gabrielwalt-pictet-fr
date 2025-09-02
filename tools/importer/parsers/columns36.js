/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area (right column)
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;
  const contentCol = Array.from(grid.children).find(col => col.classList.contains('acacias--hub-module-content-area'));
  if (!contentCol) return;
  const contentContainer = contentCol.querySelector('.cmp-container');
  if (!contentContainer) return;

  // Numbers block
  const numbersItem = contentContainer.querySelector('.acacias--comp-numbers');
  let numbersList = null;
  if (numbersItem) {
    numbersList = numbersItem.querySelector('ul');
  }
  if (!numbersList) return;
  const numberItems = Array.from(numbersList.children);
  const colCount = 3;

  // Build rows: two rows of 3 columns each
  const firstRow = [];
  const secondRow = [];
  for (let i = 0; i < colCount; i++) {
    firstRow.push(numberItems[i] || '');
  }
  for (let i = colCount; i < colCount * 2; i++) {
    secondRow.push(numberItems[i] || '');
  }

  // Footnote
  const footnoteItem = contentContainer.querySelector('.acacias--comp-small-body');
  let footnoteElem = null;
  if (footnoteItem) {
    footnoteElem = footnoteItem.querySelector('.cmp-text');
  }

  // Table header
  const headerRow = ['Columns (columns36)'];
  const tableRows = [headerRow, firstRow, secondRow];
  // If footnote, add a row with only one cell (no unnecessary empty columns)
  if (footnoteElem) {
    tableRows.push([footnoteElem]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
