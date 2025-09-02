/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .acacias-Grid inside the wrapper
  const grid = element.querySelector(':scope > .acacias-Grid');
  if (!grid) return;

  // Find all direct .acacias-GridColumn children
  const columns = Array.from(grid.querySelectorAll(':scope > .acacias-GridColumn'));
  if (!columns.length) return;

  // We'll build one row with as many columns as visually present (desktop: 1 row, 8 columns)
  // Get all link texts and the copyright text
  let cells = [];

  // Desktop: first column contains copyright, then 7 links, then share icons
  // The copyright is in the first <div class="cmp-text"> inside the first column
  const copyrightDiv = columns[0].querySelector('.cmp-text');
  if (copyrightDiv && copyrightDiv.textContent.trim()) {
    cells.push(copyrightDiv.textContent.trim());
  }

  // The links are <a> inside the first column's <ul>
  const links = columns[0].querySelectorAll('ul > li > a');
  links.forEach(a => {
    cells.push(a.textContent.trim());
  });

  // The share icons are in .acacias--share-items inside the first column
  const shareItems = columns[0].querySelector('.acacias--share-items');
  if (shareItems) {
    // Clone the node to preserve SVGs
    cells.push(shareItems.cloneNode(true));
  }

  // Build the table rows
  const headerRow = ['Columns (columns11)'];
  const bodyRow = cells;
  const tableRows = [headerRow, bodyRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
