/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the grid wrapper containing the columns
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Find the grid itself
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;

  // Find all immediate grid columns
  const gridColumns = grid.querySelectorAll(':scope > .acacias-GridColumn');
  // Defensive: There should be at least 3 columns (left, spacer, right)
  if (gridColumns.length < 3) return;

  // --- Column 1: Title (left column) ---
  let leftCol = gridColumns[0];
  // Find the title block inside leftCol
  let titleBlock = leftCol.querySelector('.cmp-title');
  // Defensive: fallback to leftCol if not found
  if (!titleBlock) titleBlock = leftCol;

  // --- Column 2: Main content (right column) ---
  let rightCol = gridColumns[2];
  // Defensive: fallback to rightCol if not found
  if (!rightCol) rightCol = gridColumns[gridColumns.length - 1];

  // Compose the right column content:
  // - Lead text
  // - Form (with all fields, captcha, button, etc)
  // - Success message (if present)
  const rightColContent = [];

  // Lead text
  const leadText = rightCol.querySelector('.acacias--comp-lead');
  if (leadText) rightColContent.push(leadText);

  // Form
  const form = rightCol.querySelector('form');
  if (form) {
    // Replace all iframes (non-image src) with links to their src
    form.querySelectorAll('iframe[src]').forEach((iframe) => {
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = iframe.src;
      iframe.replaceWith(link);
    });
    rightColContent.push(form);
  }

  // Success message (shown after form submit)
  const formSuccess = rightCol.querySelector('.acacias--form-success');
  if (formSuccess) rightColContent.push(formSuccess);

  // --- Table Construction ---
  const headerRow = ['Columns (columns30)'];
  const contentRow = [titleBlock, rightColContent];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
