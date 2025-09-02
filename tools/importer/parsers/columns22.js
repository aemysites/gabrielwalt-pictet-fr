/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create the left image column
  function getImageColumn() {
    // The left image is set as a background-image in .acacias-disclamer-photo-holder
    const photoHolder = element.querySelector('.acacias-disclamer-photo-holder');
    if (photoHolder) {
      // Extract the background-image URL
      const bg = photoHolder.style.backgroundImage;
      const urlMatch = bg.match(/url\(['"]?(.*?)['"]?\)/);
      if (urlMatch && urlMatch[1]) {
        const img = document.createElement('img');
        img.src = urlMatch[1].replace(/\\/g, '');
        img.alt = '';
        img.style.width = '100%';
        return img;
      }
    }
    // Defensive: if not found, fallback to the image wrapper
    const imgWrapper = element.querySelector('.acacias--image-wrapper-ratio img');
    if (imgWrapper) return imgWrapper;
    // If no image found, return null (no empty column)
    return null;
  }

  // Helper to create the right content column
  function getContentColumn() {
    const container = element.querySelector('.acacias--disclaimer-container');
    if (!container) return null;
    // We'll collect the logo, title, description, form, select, and legal link
    const contentParts = [];
    // Logo (two images)
    const logoDiv = container.querySelector('.acacias--disclaimer-logo');
    if (logoDiv) contentParts.push(logoDiv);
    // Title
    const titleDiv = container.querySelector('.acacias--disclaimer-title');
    if (titleDiv) contentParts.push(titleDiv);
    // Description (may be empty)
    const descDiv = container.querySelector('.acacias--disclaimer-desc:not(.desc-second)');
    if (descDiv && descDiv.textContent.trim()) contentParts.push(descDiv);
    // Form (checkbox, error, button)
    const formDiv = container.querySelector('.acacias--disclaimer-form');
    if (formDiv) contentParts.push(formDiv);
    // Second description (profile select)
    const descSecond = container.querySelector('.acacias--disclaimer-desc.desc-second');
    if (descSecond) contentParts.push(descSecond);
    // Select dropdown
    const selectDiv = container.querySelector('.acacias--disclaimer-select');
    if (selectDiv) contentParts.push(selectDiv);
    // Legal link
    const legalDiv = container.querySelector('.acacias--disclaimer-legal');
    if (legalDiv) contentParts.push(legalDiv);
    // Wrap all parts in a single div for the cell
    if (contentParts.length === 0) return null;
    const wrapper = document.createElement('div');
    contentParts.forEach(part => wrapper.appendChild(part));
    return wrapper;
  }

  // Build the table rows
  const headerRow = ['Columns (columns22)'];
  const columns = [];
  const imageColumn = getImageColumn();
  if (imageColumn) columns.push(imageColumn);
  const contentColumn = getContentColumn();
  if (contentColumn) columns.push(contentColumn);
  if (columns.length === 0) return; // nothing to do
  const secondRow = columns;

  // Create the block table
  const cells = [headerRow, secondRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
