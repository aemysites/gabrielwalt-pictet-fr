/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the image from a card column
  function extractImage(col) {
    // Try to find an <img> in this column
    const img = col.querySelector('img');
    return img || null;
  }

  // Helper to extract the full text content (title, desc, cta) from a card column
  function extractText(col) {
    const content = [];
    // Title: look for h3
    const h3 = col.querySelector('h3');
    if (h3) content.push(h3);
    // Description: all <p> elements (not just first)
    const ps = col.querySelectorAll('p');
    ps.forEach(p => {
      // Avoid duplicate CTA text if it's inside <p> (rare)
      if (!content.includes(p)) content.push(p);
    });
    // CTA: look for a.acacias--link-list-a
    const cta = col.querySelector('a.acacias--link-list-a');
    if (cta && !content.includes(cta)) content.push(cta);
    return content;
  }

  // Find all card rows: .acacias--row.acacias--hub-module
  const cardRows = Array.from(element.querySelectorAll('.acacias--row.acacias--hub-module'));

  // Defensive: skip if no cardRows
  if (!cardRows.length) return;

  // We'll collect all card rows (except the first, which is a header/intro)
  const tableRows = [];

  // Always use the required header row
  const headerRow = ['Cards (cards31)'];
  tableRows.push(headerRow);

  // Parse each card row (skip the first, which is intro)
  for (let i = 1; i < cardRows.length; i++) {
    const row = cardRows[i];
    // Find the two main columns: image and text
    const cols = row.querySelectorAll('.acacias-GridColumn.acacias--container--content-area');
    if (cols.length < 2) continue; // Defensive: skip incomplete rows
    const imgCol = cols[0];
    const textCol = cols[1];
    // Extract image (first cell)
    const image = extractImage(imgCol);
    // Extract text content (second cell)
    // Instead of just h3/p/a, include ALL direct children of textCol
    const textContent = [];
    // Find all .acacias--content-item in textCol
    const items = textCol.querySelectorAll('.acacias--content-item');
    items.forEach(item => {
      // For each item, push its .acacias--content-item-inner-wrapper children
      const inner = item.querySelector('.acacias--content-item-inner-wrapper');
      if (inner) {
        // Push all children (h3, p, ul, a, etc)
        Array.from(inner.children).forEach(child => {
          textContent.push(child);
        });
      }
    });
    // Defensive: only add if image and textContent exist
    if (image && textContent.length) {
      tableRows.push([image, textContent]);
    }
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
