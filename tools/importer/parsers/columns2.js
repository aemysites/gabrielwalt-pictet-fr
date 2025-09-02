/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a link for iframes (non-image src)
  function createLinkFromIframe(iframe) {
    if (!iframe || !iframe.src) return null;
    const a = document.createElement('a');
    a.href = iframe.src;
    a.textContent = iframe.src;
    a.target = '_blank';
    return a;
  }

  // Get the main grid wrapper (contains the columns)
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Get all top-level grid columns
  const grid = gridWrapper.querySelector('.acacias-Grid');
  if (!grid) return;
  const columns = Array.from(grid.children).filter(
    (col) => col.classList.contains('acacias-GridColumn')
  );

  // Defensive: expect at least 3 columns (left, spacer, right)
  if (columns.length < 3) return;

  // LEFT COLUMN: Title ("A propos de Pictet")
  const leftCol = columns[0];
  // Find the h2 title
  const h2Title = leftCol.querySelector('h2.cmp-title__text');
  // We'll use the h2 element directly if found

  // RIGHT COLUMN: Main content
  const rightCol = columns[2];
  // This contains the main content blocks
  const rightContent = rightCol.querySelector('.cmp-container');
  if (!rightContent) return;

  // Gather the first lead text (intro paragraph)
  const leadText = rightContent.querySelector('.acacias--comp-lead');

  // Gather the link list (ul)
  const linkList = rightContent.querySelector('.acacias--comp-link-list ul');

  // Gather the experience fragment (annual review)
  const experienceFragment = rightContent.querySelector('.cmp-experiencefragment');
  let annualReviewTitle = null;
  let annualReviewLink = null;
  if (experienceFragment) {
    // Find h3 title
    annualReviewTitle = experienceFragment.querySelector('h3.cmp-title__text');
    // Find iframe and convert to link
    const iframe = experienceFragment.querySelector('iframe');
    if (iframe) {
      annualReviewLink = createLinkFromIframe(iframe);
    }
  }

  // Gather "Nos principes directeurs" section
  const principlesTitle = rightContent.querySelector('.acacias--comp-title-h3 h3.cmp-title__text');
  // The list of principles is the next .acacias--comp-list after the title
  const principlesList = rightContent.querySelector('.acacias--comp-list ul');

  // --- Build the columns block ---
  // We'll use two columns:
  // 1. Left: Title (h2)
  // 2. Right: Main content (intro, links, annual review, principles)

  // Compose left cell
  const leftCell = h2Title ? h2Title : '';

  // Compose right cell content
  const rightCellContent = [];
  if (leadText) rightCellContent.push(leadText);
  if (linkList) rightCellContent.push(linkList);
  if (annualReviewTitle) rightCellContent.push(annualReviewTitle);
  if (annualReviewLink) rightCellContent.push(annualReviewLink);
  if (principlesTitle) rightCellContent.push(principlesTitle);
  if (principlesList) rightCellContent.push(principlesList);

  // Build the table rows
  const headerRow = ['Columns (columns2)'];
  const contentRow = [leftCell, rightCellContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
