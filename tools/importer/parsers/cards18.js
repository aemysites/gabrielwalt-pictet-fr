/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from a card link
  function getImage(link) {
    return link.querySelector('img');
  }

  // Helper to extract all text content from a card link
  function getTextContent(link) {
    // Collect all .cmp-text elements inside .text containers
    const textBlocks = [];
    link.querySelectorAll('.text .cmp-text').forEach((cmpText) => {
      if (cmpText.textContent.trim()) {
        textBlocks.push(cmpText.cloneNode(true));
      }
    });
    // Defensive: If no .cmp-text found, fallback to all text nodes
    if (textBlocks.length === 0) {
      Array.from(link.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          textBlocks.push(p);
        }
      });
    }
    return textBlocks;
  }

  // Find the cards container
  const cardsContainer = element.querySelector('.acacias--hub-module-content-area');
  const cardsParent = cardsContainer || element;

  // Find all card links (each card is an <a> with .acacias--comp-news-item)
  const cardLinks = Array.from(cardsParent.querySelectorAll('a.acacias--comp-news-item'));

  // Build table rows for each card
  const rows = cardLinks.map((link) => {
    const img = getImage(link);
    const textBlocks = getTextContent(link);
    // Ensure all text content is included, even if not inside .cmp-text
    return [img, textBlocks];
  });

  // Table header
  const headerRow = ['Cards (cards18)'];
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
