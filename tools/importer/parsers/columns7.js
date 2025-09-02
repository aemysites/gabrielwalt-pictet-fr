/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(child => child.matches(selector));
  }

  // Find the main grid wrapper
  const gridWrapper = element.querySelector('.acacias--grid-wrapper');
  if (!gridWrapper) return;

  // Get the grid columns (left title, spacer, main content)
  const gridColumns = getDirectChildren(gridWrapper.querySelector('.acacias-Grid'), '.acacias-GridColumn');
  if (gridColumns.length < 3) return;

  // Left column: Title ("A propos de Pictet")
  const leftCol = gridColumns[0];
  let leftTitle = leftCol.querySelector('.cmp-title');
  if (!leftTitle) {
    // fallback: get any h2 in leftCol
    leftTitle = leftCol.querySelector('h2');
  }
  // If still missing, fallback to textContent
  let leftCell;
  if (leftTitle) {
    leftCell = leftTitle.cloneNode(true);
  } else {
    leftCell = document.createElement('div');
    leftCell.textContent = leftCol.textContent.trim();
  }

  // Main content column
  const mainCol = gridColumns[2];
  // Get all content items in mainCol
  const contentItems = mainCol.querySelectorAll(':scope > .cmp-container > .acacias--content-item');

  // Defensive: If not enough content items, bail
  if (contentItems.length < 4) return;

  // 1. Lead text (paragraph + link)
  let leadTextBlock = contentItems[0].querySelector('.cmp-text');
  if (!leadTextBlock) {
    // fallback: get all paragraphs in first content item
    leadTextBlock = document.createElement('div');
    Array.from(contentItems[0].querySelectorAll('p')).forEach(p => leadTextBlock.appendChild(p.cloneNode(true)));
  } else {
    leadTextBlock = leadTextBlock.cloneNode(true);
  }

  // 2. Key figures block (numbers)
  const keyFiguresBlock = contentItems[1];
  const numbersList = keyFiguresBlock.querySelector('ul');
  const numberItems = numbersList ? Array.from(numbersList.children).map(li => li.cloneNode(true)) : [];
  const keyFiguresNote = keyFiguresBlock.querySelector('.cmp-text');
  let keyFiguresNoteClone = null;
  if (keyFiguresNote) keyFiguresNoteClone = keyFiguresNote.cloneNode(true);

  // 3. Image block
  const imageBlock = contentItems[2];
  const imgEl = imageBlock.querySelector('img');
  let imgClone = null;
  if (imgEl) imgClone = imgEl.cloneNode(true);

  // 4. "Nos métiers" block (title + 4 columns)
  const metiersBlock = contentItems[3];
  let metiersTitle = metiersBlock.querySelector('.cmp-title');
  if (!metiersTitle) {
    metiersTitle = metiersBlock.querySelector('h3');
  }
  let metiersTitleClone = null;
  if (metiersTitle) metiersTitleClone = metiersTitle.cloneNode(true);

  // Find the métiers list block
  let metiersListBlock = null;
  if (contentItems.length > 4) {
    metiersListBlock = contentItems[4];
  } else {
    // Try next sibling
    metiersListBlock = metiersBlock.nextElementSibling;
  }
  let metiersList = metiersListBlock ? metiersListBlock.querySelector('ul') : null;
  let metiersItems = metiersList ? Array.from(metiersList.children).map(li => li.cloneNode(true)) : [];

  // --- Build table rows ---
  const headerRow = ['Columns (columns7)'];

  // Compose right cell content
  const rightCellContent = document.createElement('div');
  if (leadTextBlock) rightCellContent.appendChild(leadTextBlock);
  if (numbersList && numberItems.length) {
    const numbersListClone = document.createElement('ul');
    numberItems.forEach(li => numbersListClone.appendChild(li));
    rightCellContent.appendChild(numbersListClone);
  }
  if (keyFiguresNoteClone) rightCellContent.appendChild(keyFiguresNoteClone);
  if (imgClone) rightCellContent.appendChild(imgClone);
  if (metiersTitleClone) rightCellContent.appendChild(metiersTitleClone);

  // Compose métiers grid (2x2)
  if (metiersItems.length === 4) {
    // Create a 2x2 grid for métiers
    const metiersGrid = document.createElement('div');
    metiersGrid.style.display = 'grid';
    metiersGrid.style.gridTemplateColumns = '1fr 1fr';
    metiersGrid.style.gap = '24px';
    metiersItems.forEach((item) => {
      metiersGrid.appendChild(item);
    });
    rightCellContent.appendChild(metiersGrid);
  } else if (metiersItems.length) {
    // fallback: just append all items in a div
    const metiersDiv = document.createElement('div');
    metiersItems.forEach(item => metiersDiv.appendChild(item));
    rightCellContent.appendChild(metiersDiv);
  }

  const contentRow = [leftCell, rightCellContent];

  // Build table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
