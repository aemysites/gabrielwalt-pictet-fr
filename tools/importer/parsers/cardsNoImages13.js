/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // 1. Header row
  const headerRow = ['Cards (cardsNoImages13)'];

  // 2. Find all timeline items (cards)
  const itemsWrapper = element.querySelector('.acacias--timeline--items-wrapper');
  if (!itemsWrapper) return;
  const itemsGrid = itemsWrapper.querySelector('.acacias--timeline--items');
  if (!itemsGrid) return;
  const cardEls = getDirectChildren(itemsGrid, '.acacias--timeline--item');

  // 3. Build card rows
  const rows = cardEls.map(cardEl => {
    // Card title
    const captionEl = cardEl.querySelector('.acacias--timeline--item-caption');
    // Card content
    const contentEl = cardEl.querySelector('.acacias--timeline--item-content');

    // Defensive: skip if no content
    if (!captionEl && !contentEl) return null;

    // Compose cell: heading, description, CTA
    const cellContent = [];
    if (captionEl) {
      // Use <strong> for heading
      const heading = document.createElement('strong');
      heading.textContent = captionEl.textContent.trim();
      cellContent.push(heading);
    }
    if (contentEl) {
      // Get all <p> inside contentEl
      const paragraphs = Array.from(contentEl.querySelectorAll('p'));
      // Find CTA link (last <a> in content)
      let cta = null;
      paragraphs.forEach(p => {
        const link = p.querySelector('a');
        if (link) cta = link;
      });
      // Add description paragraphs (excluding CTA)
      paragraphs.forEach(p => {
        // If p contains only a link, skip for description
        if (p.querySelector('a') && p.textContent.trim() === linkText(p.querySelector('a'))) return;
        // If p is empty or only &nbsp;, skip
        if (!p.textContent.trim() || p.textContent.trim() === '\u00A0') return;
        cellContent.push(p);
      });
      // Add CTA link at the end
      if (cta) {
        cellContent.push(cta);
      }
    }
    return [cellContent];
  }).filter(Boolean);

  // 4. Create table and replace
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);

  // Helper: get link text
  function linkText(link) {
    return link ? link.textContent.trim() : '';
  }
}
