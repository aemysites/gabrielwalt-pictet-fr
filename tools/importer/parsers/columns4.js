/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid wrapper for the columns
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Find the main grid containing the columns
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;

  // Get all top-level columns
  const columns = Array.from(grid.children).filter(child => child.classList.contains('acacias-GridColumn'));
  // Defensive: columns[0]=title, columns[1]=empty, columns[2]=image, columns[3]=text
  if (columns.length < 4) return;

  // --- Column 1: Title ---
  let titleCell = '';
  const titleWrapper = columns[0].querySelector('.acacias--hub-module-title');
  if (titleWrapper) {
    titleCell = titleWrapper.cloneNode(true);
  }

  // --- Column 2: Image ---
  let imageCell = '';
  const imageColumn = columns[2];
  if (imageColumn) {
    const img = imageColumn.querySelector('img');
    if (img) {
      imageCell = img.cloneNode(true);
    }
  }

  // --- Column 3: Text ---
  let textCell = '';
  const textColumn = columns[3];
  if (textColumn) {
    const textBlock = textColumn.querySelector('.cmp-text');
    if (textBlock) {
      textCell = textBlock.cloneNode(true);
    }
  }

  // Only include non-empty cells (remove empty columns)
  // But always keep the order: title, image, text
  const contentRow = [];
  if (titleCell) contentRow.push(titleCell);
  if (imageCell) contentRow.push(imageCell);
  if (textCell) contentRow.push(textCell);
  if (contentRow.length < 2) return; // Defensive: need at least two columns

  const headerRow = ['Columns (columns4)'];
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the grid wrapper (not the root element) with the block table
  gridWrapper.replaceWith(block);
}
