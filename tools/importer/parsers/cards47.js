/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main content area with cards
  const cardsContainer = element.querySelector('.acacias--hub-module-content-area');
  if (!cardsContainer) return;

  // Find all card items (each is an <a> with .acacias--comp-news-item)
  const cardLinks = Array.from(cardsContainer.querySelectorAll('a.acacias--comp-news-item'));
  if (!cardLinks.length) return;

  // Prepare header row
  const headerRow = ['Cards (cards47)'];
  const rows = [headerRow];

  // For each card, extract image and text content
  cardLinks.forEach(card => {
    // Defensive: find the image element
    const imgWrapper = card.querySelector('.acacias--image-wrapper-news');
    let imageEl = null;
    if (imgWrapper) {
      imageEl = imgWrapper.querySelector('img');
    }

    // Defensive: collect all text blocks inside the card
    const textBlocks = Array.from(card.querySelectorAll('.text'));
    // Compose a single text cell element
    const textCell = document.createElement('div');
    textCell.style.display = 'flex';
    textCell.style.flexDirection = 'column';
    textBlocks.forEach(tb => {
      // Only append the direct text content (not wrappers)
      const cmpText = tb.querySelector('.cmp-text');
      if (cmpText) {
        // If it's a title, wrap in <strong> or <h3> for semantics
        if (tb.classList.contains('large-body') || tb.classList.contains('video') || tb.classList.contains('news')) {
          const heading = document.createElement('strong');
          heading.textContent = cmpText.textContent;
          textCell.appendChild(heading);
        } else {
          // Date or type info
          const meta = document.createElement('div');
          meta.textContent = cmpText.textContent;
          meta.style.fontSize = 'smaller';
          textCell.appendChild(meta);
        }
      }
    });

    // Add the card row: [image, text]
    rows.push([
      imageEl || '',
      textCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
