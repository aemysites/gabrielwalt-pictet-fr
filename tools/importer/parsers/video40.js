/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct block header
  const headerRow = ['Video (video40)'];

  // Extract all text content from the original HTML, including whitespace
  // Requirement: All content from the original HTML must be included in the cell
  // The HTML contains only structure and whitespace, so we must include that whitespace
  let content = element.textContent;
  // Do not trim, preserve whitespace as in the original HTML
  const contentRow = [content];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
