/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the nav containing the columns
  const nav = element.querySelector('nav.cmp-navigation');
  if (!nav) return;

  // Get all top-level columns (ul.acacias-GridColumn)
  const columns = Array.from(nav.querySelectorAll(':scope > ul.acacias-GridColumn'));
  if (!columns.length) return;

  // For each column, extract the header and the list of links
  const columnCells = columns.map((col) => {
    // Defensive: find the level-0 item (should be only one per column)
    const level0 = col.querySelector(':scope > li.cmp-navigation__item--level-0');
    if (!level0) return document.createElement('div');

    // Get the header text (inside .cmp-text)
    const headerDiv = level0.querySelector('.cmp-text');
    let headerText = '';
    if (headerDiv) {
      headerText = headerDiv.textContent.trim();
    }
    // Create a header element (strong for semantic, or just a div)
    const headerElem = document.createElement('div');
    headerElem.style.fontWeight = 'bold';
    headerElem.textContent = headerText;

    // Get the sub-list (ul.cmp-navigation__group inside level-0)
    const subList = level0.querySelector('ul.cmp-navigation__group');
    let listElem = null;
    if (subList) {
      // Clone the list to avoid moving it from the DOM
      listElem = subList.cloneNode(true);
      // Remove classes for cleaner output (optional)
      listElem.className = '';
      Array.from(listElem.querySelectorAll('li')).forEach(li => li.className = '');
      Array.from(listElem.querySelectorAll('a')).forEach(a => a.className = '');
    }

    // Compose the column cell: header + list
    const cellContent = [];
    if (headerText) cellContent.push(headerElem);
    if (listElem) cellContent.push(listElem);
    return cellContent;
  });

  // Table header row
  const headerRow = ['Columns (columns3)'];
  // Table content row: one cell per column
  const contentRow = columnCells;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
