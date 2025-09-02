/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main cards list
  const cardsList = element.querySelector('.acacias--comp-list .acacias--content-item-inner-wrapper');
  if (!cardsList) return;

  // Get all card <li> elements
  const cardItems = Array.from(cardsList.children).filter(child => child.tagName === 'LI');

  // Table header: must be exactly 'Cards (cards15)'
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // For each card, build a row: [image/icon (empty string), text content]
  cardItems.forEach(card => {
    const anchor = card.querySelector('a.acacias--comp-list-item-content-wrapper');
    if (!anchor) return;

    // Title (h4)
    const title = anchor.querySelector('.cmp-title__text');
    // Description (all <p> except last)
    const paragraphs = anchor.querySelectorAll('.cmp-text p');
    let description = null;
    let cta = null;
    if (paragraphs.length > 1) {
      description = Array.from(paragraphs).slice(0, -1).map(p => p.cloneNode(true));
      cta = paragraphs[paragraphs.length - 1].cloneNode(true);
    } else if (paragraphs.length === 1) {
      description = [paragraphs[0].cloneNode(true)];
    }

    // Compose cell content
    const cellContent = [];
    if (title) cellContent.push(title.cloneNode(true));
    if (description) cellContent.push(...description);
    if (cta) cellContent.push(cta);

    // Always two columns: first is empty string (no image), second is text content
    rows.push(['', cellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
