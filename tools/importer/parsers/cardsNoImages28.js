/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two card columns (they have data-preview="small")
  const cards = Array.from(element.querySelectorAll('[data-preview="small"]'));

  // Build the rows for the table
  const rows = [];
  // Header row
  rows.push(['Cards (cardsNoImages28)']);

  // Each card: put the whole card content (heading + description + CTA) in a single cell
  cards.forEach(card => {
    // Try to get the main content block (either .text or h4)
    let cardContent = card.querySelector('.text');
    if (!cardContent) {
      cardContent = card.querySelector('h4');
    }
    // Fallback: use the card itself if nothing else
    if (!cardContent) cardContent = card;
    // Instead of passing the element, extract its HTML so all text is included
    rows.push([cardContent.innerHTML || cardContent.textContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
