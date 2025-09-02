/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as a single-cell header row
  const headerRow = ['Columns (columns21)'];

  // Find the main grid wrapper for the columns
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Get the columns inside the grid
  const grid = gridWrapper.querySelector('.acacias--comp-map.acacias-Grid');
  if (!grid) return;
  const columns = Array.from(grid.querySelectorAll(':scope > .acacias-GridColumn'));
  if (columns.length < 2) return;

  // --- LEFT CELL: All text content from the first column ---
  let leftCell = document.createElement('div');
  // Get all text nodes and links from the first column
  const titleCol = columns[0];
  // Get all elements with text (e.g., h2, etc.)
  Array.from(titleCol.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
      leftCell.appendChild(node.cloneNode(true));
    }
  });

  // --- RIGHT CELL: All text content from the second column, including links ---
  let rightCell = document.createElement('div');
  const descCol = columns[1];
  Array.from(descCol.childNodes).forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
      rightCell.appendChild(node.cloneNode(true));
    }
  });

  // Also add the map SVG from the .acacias--map (if present)
  const mapCol = columns.find(col => col.querySelector('.acacias--map'));
  if (mapCol) {
    const mapDiv = mapCol.querySelector('.acacias--map');
    if (mapDiv) {
      const svg = mapDiv.querySelector('svg');
      if (svg) {
        rightCell.appendChild(svg.cloneNode(true));
      }
    }
  }

  // Table structure: header, then one row with two columns
  const contentRow = [leftCell, rightCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
