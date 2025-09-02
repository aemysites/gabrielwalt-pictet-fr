/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two columns in the grid
  const columns = Array.from(element.querySelectorAll(':scope > .acacias-GridColumn'));

  // Defensive: ensure we have two columns
  const leftCol = columns[0] || document.createElement('div');
  const rightCol = columns[1] || document.createElement('div');

  // LEFT COLUMN: extract all relevant content
  // Use the inner wrapper if present
  let leftContent = leftCol.querySelector('.acacias--service-stage-left-col-inner-wrapper') || leftCol;

  // RIGHT COLUMN: extract the image wrapper (contains the image)
  let rightContent = rightCol.querySelector('.acacias--image-wrapper-ratio') || rightCol;

  // Table header must match block name exactly
  const headerRow = ['Columns (columns19)'];
  const contentRow = [leftContent, rightContent];

  // Build table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
