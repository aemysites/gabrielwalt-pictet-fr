/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirements
  const headerRow = ['Hero (hero34)'];

  // No background image in this HTML, so row 2 is empty
  const imageRow = [''];

  // Find the main content column (should contain the title and CTA)
  // Defensive: look for the column with the title
  let contentCol = null;
  const gridColumns = element.querySelectorAll(':scope > div');
  for (const col of gridColumns) {
    if (col.querySelector('.acacias--home-stage-title')) {
      contentCol = col;
      break;
    }
  }
  if (!contentCol) {
    // Fallback: use the first column
    contentCol = gridColumns[0];
  }

  // Get the title (h2)
  const title = contentCol.querySelector('.acacias--home-stage-title');

  // Get the CTA (link)
  let cta = null;
  const ctaContainer = contentCol.querySelector('.acacias--home-stage-lead');
  if (ctaContainer) {
    cta = ctaContainer.querySelector('a');
  }

  // Compose content row: title (as heading), then CTA (if present)
  const contentRowContent = [];
  if (title) contentRowContent.push(title);
  if (cta) contentRowContent.push(cta);

  const contentRow = [contentRowContent];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
