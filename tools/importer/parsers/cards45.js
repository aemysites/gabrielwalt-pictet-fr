/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card text content from list items
  function extractCardTextContent(cardLink) {
    const textParts = [];
    // Title (h4)
    const title = cardLink.querySelector('.cmp-title__text');
    if (title) {
      const h4 = document.createElement('h4');
      h4.textContent = title.textContent;
      textParts.push(h4);
    }
    // Description (first p)
    const desc = cardLink.querySelector('.cmp-text p');
    if (desc) {
      const p = document.createElement('p');
      p.innerHTML = desc.innerHTML;
      textParts.push(p);
    }
    // CTA (last p with .acacias--cta-underlined)
    const ctaSpan = cardLink.querySelector('.acacias--cta-underlined');
    if (ctaSpan && ctaSpan.closest('a')) {
      // If CTA is a link, use it
      const ctaLink = document.createElement('a');
      ctaLink.href = cardLink.href;
      ctaLink.textContent = ctaSpan.textContent;
      textParts.push(ctaLink);
    } else if (ctaSpan) {
      // Otherwise, just span text
      textParts.push(ctaSpan.cloneNode(true));
    }
    return textParts;
  }

  // Helper to extract contact card text content
  function extractContactTextContent(contactLink) {
    const textParts = [];
    // Name
    const name = contactLink.querySelector('.cmp-title__text');
    if (name) {
      const h4 = document.createElement('h4');
      h4.textContent = name.textContent;
      textParts.push(h4);
    }
    // Role/Description
    const desc = contactLink.querySelector('.cmp-text');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textParts.push(p);
    }
    // CTA (Envoyer un message)
    const ctaDiv = contactLink.querySelector('.acacias--contact-cta');
    if (ctaDiv) {
      // Find the text node after the SVG
      const ctaText = Array.from(ctaDiv.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());
      if (ctaText) {
        const ctaLink = document.createElement('a');
        ctaLink.href = contactLink.href;
        ctaLink.textContent = ctaText.textContent.trim();
        textParts.push(ctaLink);
      }
    }
    return textParts;
  }

  // Find the content area (main cards and contacts)
  const contentArea = element.querySelector('.acacias--hub-module-content-area');
  if (!contentArea) return;

  const cells = [];
  // Header row
  cells.push(['Cards (cards45)']);

  // --- Main cards ---
  const cardList = contentArea.querySelector('.acacias--comp-list ul');
  if (cardList) {
    const cardItems = cardList.querySelectorAll(':scope > li');
    cardItems.forEach(li => {
      const cardLink = li.querySelector('a');
      if (!cardLink) return;
      // Try to find an icon or border as an image substitute
      let imgCell = '';
      const borderDiv = cardLink.querySelector('.acacias--comp-list-border');
      if (borderDiv) {
        // Use a simple icon placeholder (SVG) for the card border
        const svg = document.createElement('svg');
        svg.setAttribute('width', '32');
        svg.setAttribute('height', '32');
        svg.setAttribute('viewBox', '0 0 32 32');
        svg.innerHTML = '<rect width="32" height="32" rx="6" fill="#eee"/>';
        imgCell = svg;
      }
      const textCell = extractCardTextContent(cardLink);
      cells.push([imgCell, textCell]);
    });
  }

  // --- Contacts cards ---
  const contactsList = contentArea.querySelector('.acacias--comp-contacts');
  if (contactsList) {
    const contactItems = contactsList.querySelectorAll(':scope > li');
    contactItems.forEach(li => {
      const contactLink = li.querySelector('a');
      if (!contactLink) return;
      // Image
      const img = contactLink.querySelector('img');
      let imgCell = '';
      if (img) {
        imgCell = img;
      }
      // Text content
      const textCell = extractContactTextContent(contactLink);
      cells.push([imgCell, textCell]);
    });
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
