/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the target block name as the header row
  const headerRow = ['Columns (columns9)'];

  // Find the grid wrapper and columns
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;
  const gridCols = grid.querySelectorAll(':scope > .acacias-GridColumn');

  // Left column: sticky header (title)
  let leftCol = Array.from(gridCols).find(col => col.querySelector('.acacias--sticky-header'));
  if (!leftCol) leftCol = gridCols[0];
  const leftContent = leftCol.querySelector('.acacias--sticky-header');

  // Right column: content area
  const contentCol = Array.from(gridCols).find(col => col.classList.contains('acacias--hub-module-content-area'));
  if (!contentCol) return;
  const contentContainer = contentCol.querySelector('.cmp-container');
  if (!contentContainer) return;

  // Collect all content items in order
  const contentItems = Array.from(contentContainer.children);

  // We'll build the right column by collecting all content blocks
  const rightColContent = document.createElement('div');
  contentItems.forEach(item => {
    // For each item, clone and append to rightColContent
    rightColContent.appendChild(item.cloneNode(true));
  });

  // Compose the table: header, then a row with leftCol and rightCol
  const tableRows = [
    headerRow,
    [leftContent, rightColContent]
  ];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
