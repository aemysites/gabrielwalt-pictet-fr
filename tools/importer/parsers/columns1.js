/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate grid columns (main content columns)
  const grid = element.querySelector('.acacias-Grid');
  if (!grid) return;
  const columns = Array.from(grid.children).filter(col => col.classList.contains('acacias-GridColumn'));

  // Defensive: expect left (author/share), center (main), right (empty/footnotes)
  // We'll use only left and center columns for the block
  // Left column: author/share info
  const leftCol = columns.find(col => col.classList.contains('acacias--article-left-col'));
  // Center column: main article content
  const centerCol = columns.find(col => col.classList.contains('acacias--content-area'));

  // Defensive: skip if missing
  if (!leftCol || !centerCol) return;

  // --- LEFT COLUMN CONTENT ---
  // Author tag (photo, name, title)
  const authorTag = leftCol.querySelector('.acacias--author-tag');
  // Share buttons (LinkedIn, X, Facebook, Email)
  const shareAside = leftCol.querySelector('.acacias--article-share');
  // Compose left cell content
  const leftCellContent = [];
  if (authorTag) leftCellContent.push(authorTag);
  if (shareAside) leftCellContent.push(shareAside);

  // --- CENTER COLUMN CONTENT ---
  // All main content items (text, quote, link)
  const centerItems = Array.from(centerCol.querySelectorAll(':scope > *'));
  // Compose center cell content
  const centerCellContent = [];
  centerItems.forEach(item => {
    // Defensive: skip empty footnotes
    if (item.classList.contains('acacias--footnotes')) return;
    centerCellContent.push(item);
  });

  // --- TABLE STRUCTURE ---
  const headerRow = ['Columns (columns1)'];
  const contentRow = [leftCellContent, centerCellContent];
  const cells = [headerRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
