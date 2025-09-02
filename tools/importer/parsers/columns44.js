/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure element exists and is a container
  if (!element || !element.querySelectorAll) return;

  // Table header row as required
  const headerRow = ['Columns (columns44)'];

  // Get all top-level navigation columns (ul.acacias-GridColumn)
  const columns = Array.from(element.querySelectorAll(':scope nav > ul.acacias-GridColumn'));

  // For each column, collect the entire <ul> as the cell content
  // This preserves the heading and the list of links as in the screenshot
  const contentRow = columns.map((col) => col);

  // Build the table data
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
