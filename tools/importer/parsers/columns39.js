/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all direct column children
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // There should be 3 columns for this block
  if (columns.length < 3) return;

  // First column: Newsletter title
  const col1 = columns[0];
  // Second column: Description text
  const col2 = columns[1];
  // Third column: Newsletter form
  const col3 = columns[2];

  // For each column, extract the main content block
  // 1. Title (h2)
  let titleContent = col1;
  // 2. Description (text)
  let descContent = col2;
  // 3. Form (form and related messages)
  let formContent = col3;

  // Compose the table rows
  const headerRow = ['Columns (columns39)'];
  const contentRow = [titleContent, descContent, formContent];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
