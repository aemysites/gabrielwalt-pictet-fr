/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract cards from a news-featured block
  function extractCardsFromFeaturedBlock(block) {
    const cards = [];
    // Each card is an <a> with class acacias--comp-news-item
    const cardLinks = block.querySelectorAll('a.acacias--comp-news-item');
    cardLinks.forEach((a) => {
      // Find image (first .cmp-image__image inside)
      const img = a.querySelector('.cmp-image__image');
      // Find all text blocks (date/category, title, etc.)
      const textBlocks = [];
      // Date/category
      const navText = a.querySelector('.text.acacias--navigation');
      if (navText) textBlocks.push(navText);
      // Title/description (large-body, video, news)
      const titleText = a.querySelector('.text.large-body, .text.video, .text.news');
      if (titleText) textBlocks.push(titleText);
      // Compose text cell
      const textCell = document.createElement('div');
      textBlocks.forEach(tb => {
        if (tb) textCell.appendChild(tb.cloneNode(true));
      });
      // Compose image cell
      let imageCell = '';
      if (img) {
        imageCell = img.cloneNode(true);
      }
      cards.push([imageCell, textCell]);
    });
    // Check for 'show more' link (not button)
    const showMoreDiv = block.querySelector('.acacias--comp-news-showmore .text .cmp-text a');
    if (showMoreDiv) {
      // Add a row with empty image cell and the link in text cell
      cards.push(['', showMoreDiv.cloneNode(true)]);
    }
    return cards;
  }

  // Find all news-featured blocks inside the main element
  const featuredBlocks = element.querySelectorAll('.acacias--comp-news-featured');
  const allCards = [];
  featuredBlocks.forEach((block) => {
    allCards.push(...extractCardsFromFeaturedBlock(block));
  });

  // Build table rows
  const headerRow = ['Cards (cards5)'];
  const tableRows = [headerRow, ...allCards];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element
  element.replaceWith(block);
}
