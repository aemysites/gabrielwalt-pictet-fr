/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the content area with the cards
  const contentArea = element.querySelector('.acacias--hub-module-content-area');
  if (!contentArea) return;

  // Find the lead/intro text (optional, may be included as a card)
  const leadItem = contentArea.querySelector('.acacias--comp-lead');
  let leadText = null;
  if (leadItem) {
    // Use the whole lead block as a card cell
    leadText = leadItem;
  }

  // Find the card list
  const listItem = contentArea.querySelector('.acacias--comp-list');
  if (!listItem) return;

  // Each card is a <li> inside the <ul>
  const cardNodes = listItem.querySelectorAll('ul > li');

  // Build table rows
  const rows = [];

  // Header row
  rows.push(['Cards (cardsNoImages8)']);

  // Optionally add the lead text as the first card row
  if (leadText) {
    rows.push([leadText]);
  }

  // Add each card as a row
  cardNodes.forEach((li) => {
    // The card is the <a> inside the <li>
    const cardContent = li.querySelector('a');
    if (cardContent) {
      rows.push([cardContent]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
