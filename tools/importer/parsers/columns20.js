/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get all direct grid columns
  const columns = Array.from(element.querySelectorAll(':scope > .acacias-GridColumn'));
  if (columns.length < 2) return; // must have at least two columns

  // LEFT COLUMN: grab all content from left col inner wrapper
  const leftCol = columns[0];
  const leftInner = leftCol.querySelector('.acacias--service-stage-left-col-inner-wrapper');
  // Defensive: fallback to leftCol if inner wrapper missing
  const leftContent = leftInner ? leftInner : leftCol;

  // RIGHT COLUMN: find image (picture)
  const rightCol = columns[1];
  const picture = rightCol.querySelector('picture');
  // Defensive: fallback to rightCol if picture missing
  const rightContent = picture ? picture : rightCol;

  // Table header row
  const headerRow = ['Columns (columns20)'];
  // Table content row: left and right columns
  const contentRow = [leftContent, rightContent];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
