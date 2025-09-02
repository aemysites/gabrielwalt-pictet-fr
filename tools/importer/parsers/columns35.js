/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  const getChildren = (parent, selector) => Array.from(parent.querySelectorAll(selector));

  // 1. Header row
  const headerRow = ['Columns (columns35)'];

  // 2. Content rows
  // --- Title ---
  const titleCol = element.querySelector('.acacias--hub-module-title');

  // --- Lead paragraph ---
  const leadCol = element.querySelector('.acacias--comp-lead');

  // --- List block (4 items, 2 columns) ---
  const listBlock = element.querySelector('.acacias--comp-list ul');
  let listRows = [];
  if (listBlock) {
    const items = getChildren(listBlock, ':scope > li');
    items.forEach(item => {
      // Left: title
      const left = item.querySelector('.acacias-GridColumn:first-child');
      // Right: text
      const right = item.querySelector('.acacias-GridColumn:last-child');
      listRows.push([
        left,
        right
      ]);
    });
  }

  // --- Chiffres clés (numbers) ---
  const numbersTitle = element.querySelector('.acacias--comp-title-h3 .cmp-title__text');
  const numbersBlock = element.querySelector('.acacias--comp-numbers ul');
  let numbersRow = [];
  if (numbersBlock) {
    const numberItems = getChildren(numbersBlock, ':scope > li');
    numbersRow = numberItems.map(item => item);
  }

  // --- Images d’aujourd’hui ---
  const imagesTitle = Array.from(element.querySelectorAll('.acacias--comp-title-h3 .cmp-title__text')).find(e => e.textContent.includes('Images d’aujourd’hui'));
  const imagesGallery = element.querySelector('.smallcontentgallery .acacias--small-content-gallery.small-content-gallery-b .acacias--content-item-inner-wrapper');
  let imagesRow = [];
  if (imagesGallery) {
    const galleryItems = getChildren(imagesGallery, ':scope > .small-content-gallery-item');
    imagesRow = galleryItems.map(item => item);
  }

  // --- Et pendant ce temps... ---
  const meantimeTitle = Array.from(element.querySelectorAll('.acacias--comp-title-h3 .cmp-title__text')).find(e => e.textContent.includes('Et pendant ce temps'));
  const meantimeText = element.querySelector('.acacias--comp-2-cols-fluid .cmp-text');

  // --- Group photo block ---
  const groupPhotoBlock = element.querySelector('.acacias--comp-image');

  // --- Second gallery ---
  const galleryA = element.querySelector('.smallcontentgallery .acacias--small-content-gallery.small-content-gallery-a .acacias--content-item-inner-wrapper');
  let galleryARow = [];
  if (galleryA) {
    const galleryAItems = getChildren(galleryA, ':scope > .small-content-gallery-item');
    galleryARow = galleryAItems.map(item => item);
  }

  // --- Quote block ---
  const quoteBlock = element.querySelector('.acacias--row.acacias--full-width-module.acacias--quote-small blockquote');
  const quoteCaption = element.querySelector('.acacias--row.acacias--full-width-module.acacias--quote-small figcaption');
  let quoteCell = null;
  if (quoteBlock) {
    // Compose blockquote and caption in one cell
    const frag = document.createDocumentFragment();
    frag.appendChild(quoteBlock);
    if (quoteCaption) frag.appendChild(quoteCaption);
    quoteCell = frag;
  }

  // --- Compose table rows ---
  const cells = [
    headerRow,
    // Lead and Title
    [titleCol],
    [leadCol],
    // List block (4 rows, 2 columns)
    ...listRows,
    // Chiffres clés title and numbers
    [numbersTitle],
    numbersRow,
    // Images d’aujourd’hui title and gallery
    [imagesTitle],
    imagesRow,
    // Meantime title and text
    [meantimeTitle],
    [meantimeText],
    // Group photo block
    [groupPhotoBlock],
    // Second gallery
    galleryARow,
    // Quote block
    quoteCell ? [quoteCell] : []
  ].filter(row => row && row.length > 0 && !(Array.isArray(row) && row.every(cell => !cell)));

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
