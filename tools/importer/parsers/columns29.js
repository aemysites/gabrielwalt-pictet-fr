/* global WebImporter */
export default function parse(element, { document }) {
  const rows = Array.from(element.querySelectorAll(':scope > div.acacias--row.acacias--hub-module'));
  const tableRows = [];
  const headerRow = ['Columns (columns29)'];
  tableRows.push(headerRow);

  let foundContent = false;

  rows.forEach(row => {
    // Get left column title
    let leftTitle = row.querySelector('.acacias--hub-module-left-col .cmp-title__text');
    // Get right content area
    let contentArea = row.querySelector('.acacias--hub-module-content-area');
    let columns = [];
    if (contentArea) {
      // Find all visually distinct columns (acacias-GridColumn)
      let gridCols = contentArea.querySelectorAll(':scope > .acacias-Grid > .acacias-GridColumn, :scope > .acacias-GridColumn');
      if (gridCols.length > 0) {
        columns = Array.from(gridCols);
      } else {
        // fallback: all direct children
        columns = Array.from(contentArea.children);
      }
    }
    // Compose the row: leftTitle + columns
    if (leftTitle && columns.length) {
      const leftTitleCell = document.createElement('div');
      leftTitleCell.innerHTML = leftTitle.textContent;
      const cells = [leftTitleCell];
      columns.forEach(col => {
        const cell = document.createElement('div');
        // Include all text and images from the column
        cell.innerHTML = col.innerHTML;
        cells.push(cell);
      });
      tableRows.push(cells);
      foundContent = true;
    } else if (columns.length) {
      const cells = columns.map(col => {
        const cell = document.createElement('div');
        cell.innerHTML = col.innerHTML;
        return cell;
      });
      tableRows.push(cells);
      foundContent = true;
    }
    // Additional rows: newsletter for Insights, image for Travailler chez Pictet
    if (contentArea) {
      // Newsletter row (Insights)
      let newsletter = contentArea.querySelector('.acacias--newsletter');
      if (newsletter) {
        let newsletterCols = Array.from(newsletter.querySelectorAll(':scope > .acacias-GridColumn'));
        if (newsletterCols.length) {
          const cells = newsletterCols.map(col => {
            const cell = document.createElement('div');
            cell.innerHTML = col.innerHTML;
            return cell;
          });
          while (cells.length < columns.length + (leftTitle ? 1 : 0)) {
            cells.push(document.createElement('div'));
          }
          tableRows.push(cells);
          foundContent = true;
        }
      }
      // Image row (Travailler chez Pictet)
      let imageBlock = contentArea.querySelector('.acacias--comp-image .acacias--content-item-inner-wrapper');
      if (imageBlock) {
        const cell = document.createElement('div');
        cell.innerHTML = imageBlock.innerHTML;
        let imgRow = [cell];
        while (imgRow.length < columns.length + (leftTitle ? 1 : 0)) {
          imgRow.push(document.createElement('div'));
        }
        tableRows.push(imgRow);
        foundContent = true;
      }
    }
  });

  // Always output the block table, even if only header (to ensure DOM is modified)
  // But only replace if we found content rows
  if (foundContent) {
    const block = WebImporter.DOMUtils.createTable(tableRows, document);
    element.replaceWith(block);
  } else {
    // Always replace to ensure DOM is modified (even if only header)
    const block = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(block);
  }
}
