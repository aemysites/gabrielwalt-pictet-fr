/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid wrapper containing the two columns
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;
  const columns = Array.from(grid.children);
  if (columns.length < 2) return;

  // Identify left and right columns
  const leftCol = columns.find(col => col.classList.contains('acacias--quote-module-left-col'));
  const rightCol = columns.find(col => col.classList.contains('acacias--quote-module-right-col'));
  if (!leftCol || !rightCol) return;

  // For left: use the image wrapper if present, else the column itself
  const imageWrapper = leftCol.querySelector('.acacias--image');
  const leftContent = imageWrapper || leftCol;

  // For right: use the figure if present, else the column itself
  const quoteFigure = rightCol.querySelector('figure');
  const rightContent = quoteFigure || rightCol;

  // Build the table: header row and content row
  const headerRow = ['Columns (columns37)'];
  const contentRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
