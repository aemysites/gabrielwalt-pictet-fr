/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid wrapper (contains columns)
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Get direct grid columns
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;
  const gridColumns = grid.querySelectorAll(':scope > .acacias-GridColumn');
  if (gridColumns.length < 3) return;

  // Title column
  const titleCol = gridColumns[0];
  let titleCell = '';
  const titleText = titleCol.textContent.trim();
  if (titleText) {
    titleCell = document.createElement('div');
    titleCell.textContent = titleText;
  }

  // Content column (contains 2 columns: text, links)
  const contentCol = gridColumns[2];
  const contentGrid = contentCol.querySelector('.acacias-Grid');
  if (!contentGrid) return;
  const contentGridColumns = contentGrid.querySelectorAll(':scope > .acacias-GridColumn');
  if (contentGridColumns.length < 2) return;

  // Left: text
  const textCol = contentGridColumns[0];
  let textCell = '';
  const textContent = textCol.textContent.trim();
  if (textContent) {
    textCell = document.createElement('div');
    textCell.textContent = textContent;
  }

  // Right: links (list)
  const linksCol = contentGridColumns[1];
  let linksCell = '';
  const linksContent = linksCol.textContent.trim();
  if (linksContent) {
    linksCell = document.createElement('div');
    linksCell.textContent = linksContent;
  }

  // Compose the table, removing empty columns
  const headerRow = ['Columns (columns10)'];
  const contentRow = [];
  if (titleCell) contentRow.push(titleCell);
  if (textCell) contentRow.push(textCell);
  if (linksCell) contentRow.push(linksCell);
  if (contentRow.length === 0) return;
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
