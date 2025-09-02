/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(el => el.matches(selector));
  }

  // --- 1. HEADER ROW ---
  const headerRow = ['Columns (columns12)'];

  // --- 2. MAIN CONTENT ROW ---
  // We'll build up the columns for the main content row
  // Left column: Title and lead text
  let leftColContent = [];
  // Find the left column title
  const leftTitleCol = element.querySelector('.acacias--hub-module-left-col .acacias--hub-module-title');
  if (leftTitleCol) leftColContent.push(leftTitleCol);
  // Find the lead text (intro paragraph)
  const leadText = element.querySelector('.acacias--hub-module-content-area .acacias--comp-lead');
  if (leadText) leftColContent.push(leadText);

  // Right column: The main list (context, chez pictet, etc.)
  let rightColContent = [];
  const mainList = element.querySelector('.acacias--hub-module-content-area .acacias--comp-list');
  if (mainList) rightColContent.push(mainList);

  // --- 3. ADDITIONAL ROWS ---
  // Chiffres clés (numbers)
  const chiffresTitle = element.querySelector('.acacias--comp-title-h3 .cmp-title__text');
  const chiffresBlock = element.querySelector('.acacias--comp-numbers');
  if (chiffresTitle && chiffresBlock) {
    // Chiffres clés row: 2 columns
    rightColContent.push(chiffresTitle.parentElement.parentElement.parentElement.parentElement); // full .acacias--comp-title-h3 block
    rightColContent.push(chiffresBlock);
  }

  // Images d'époque
  const imagesTitle = Array.from(element.querySelectorAll('.acacias--comp-title-h3 .cmp-title__text')).find(h3 => h3.textContent.includes("Images d’époque"));
  const imagesGallery = element.querySelector('.smallcontentgallery .acacias--small-content-gallery');
  if (imagesTitle && imagesGallery) {
    rightColContent.push(imagesTitle.parentElement.parentElement.parentElement.parentElement);
    rightColContent.push(imagesGallery);
  }

  // Acte de fondation image and caption
  const acteImageBlock = element.querySelector('.acacias--comp-image');
  if (acteImageBlock) rightColContent.push(acteImageBlock);

  // Et pendant ce temps…
  const etPendantTitle = Array.from(element.querySelectorAll('.acacias--comp-title-h3 .cmp-title__text')).find(h3 => h3.textContent.includes('Et pendant ce temps…'));
  const etPendantText = element.querySelector('.acacias--comp-2-cols-fluid');
  if (etPendantTitle && etPendantText) {
    rightColContent.push(etPendantTitle.parentElement.parentElement.parentElement.parentElement);
    rightColContent.push(etPendantText);
  }

  // Second images gallery (below "Et pendant ce temps…")
  const secondGallery = Array.from(element.querySelectorAll('.smallcontentgallery .acacias--small-content-gallery')).find(gal => gal.classList.contains('small-content-gallery-a'));
  if (secondGallery) rightColContent.push(secondGallery);

  // Quote block
  const quoteBlock = element.querySelector('.acacias--quote-small');
  if (quoteBlock) rightColContent.push(quoteBlock);

  // Wolfgang-Adam Töpffer block (two columns)
  const topfferBlock = element.querySelector('.acacias--comp-two-cols-static');
  if (topfferBlock) rightColContent.push(topfferBlock);

  // --- 4. BUILD TABLE ROWS ---
  // First row: header
  // Second row: two columns (leftColContent, rightColContent)
  const rows = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  // --- 5. CREATE TABLE AND REPLACE ---
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
