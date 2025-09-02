/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Columns (columns25)'];

  // 2. Find the main grid wrapper
  const gridWrapper = getChildByClass(element, 'acacias--grid-wrapper');
  if (!gridWrapper) return;
  const grid = getChildByClass(gridWrapper, 'acacias-Grid');
  if (!grid) return;

  // 3. Get the three columns (left, spacer, right)
  const columns = Array.from(grid.children).filter(col => col.classList.contains('acacias-GridColumn'));
  if (columns.length < 3) return;

  // 4. Left column: title
  const leftCol = columns[0];
  let title = leftCol.querySelector('.cmp-title h2');
  if (!title) {
    title = leftCol.querySelector('h2');
  }
  let leftCellContent;
  if (title) {
    leftCellContent = document.createElement('div');
    leftCellContent.textContent = title.textContent.trim();
  } else {
    leftCellContent = document.createElement('div');
    leftCellContent.textContent = leftCol.textContent.trim();
  }

  // 5. Right column: main content area
  const rightCol = columns[2];
  const contentArea = rightCol.querySelector('.acacias--hub-module-content-area, .acacias--container--content-area') || rightCol;
  const mainContainer = contentArea.querySelector('.cmp-container') || contentArea;
  const mainContentBlocks = Array.from(mainContainer.children);

  // Lead text
  const leadBlock = mainContentBlocks.find(el => el.classList.contains('acacias--comp-lead'));
  let leadText = null;
  if (leadBlock) {
    const cmpText = leadBlock.querySelector('.cmp-text');
    if (cmpText) {
      leadText = document.createElement('div');
      Array.from(cmpText.querySelectorAll('p')).forEach(p => {
        leadText.appendChild(p.cloneNode(true));
      });
    }
  }

  // Two-column block: image and quote
  const twoColsBlock = mainContentBlocks.find(el => el.classList.contains('acacias--comp-two-cols-static'));
  let imageEl = null;
  let quoteEl = null;
  if (twoColsBlock) {
    const innerGrid = twoColsBlock.querySelector('.acacias-Grid');
    if (innerGrid) {
      const innerCols = Array.from(innerGrid.children).filter(col => col.classList.contains('acacias-GridColumn'));
      if (innerCols.length >= 2) {
        // Image
        const imgContainer = innerCols[0].querySelector('.cmp-image img');
        if (imgContainer) {
          imageEl = imgContainer.cloneNode(true);
        }
        // Quote
        const quoteContainer = innerCols[1].querySelector('.cmp-text');
        if (quoteContainer) {
          quoteEl = document.createElement('div');
          const h3i = quoteContainer.querySelector('h3 i');
          if (h3i) {
            quoteEl.appendChild(h3i.cloneNode(true));
          }
          const blockquote = quoteContainer.querySelector('blockquote');
          if (blockquote) {
            quoteEl.appendChild(blockquote.cloneNode(true));
          }
        }
      }
    }
  }

  // Compose right cell: lead text, then row with image and quote
  const rightCellDiv = document.createElement('div');
  if (leadText) rightCellDiv.appendChild(leadText);
  if (imageEl || quoteEl) {
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex';
    rowDiv.style.gap = '2em';
    rowDiv.style.alignItems = 'flex-start';
    if (imageEl) {
      const imgDiv = document.createElement('div');
      imgDiv.appendChild(imageEl);
      rowDiv.appendChild(imgDiv);
    }
    if (quoteEl) {
      const quoteDiv = document.createElement('div');
      quoteDiv.appendChild(quoteEl);
      rowDiv.appendChild(quoteDiv);
    }
    rightCellDiv.appendChild(rowDiv);
  }

  // Only add right cell if it has actual content
  let cells;
  if (rightCellDiv.childNodes.length) {
    cells = [
      headerRow,
      [leftCellContent, rightCellDiv]
    ];
  } else {
    cells = [
      headerRow,
      [leftCellContent]
    ];
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
