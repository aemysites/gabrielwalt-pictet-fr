/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the left column title
  function getTitleCol() {
    const gridCols = element.querySelectorAll(':scope .acacias-GridColumn');
    for (const col of gridCols) {
      if (col.classList.contains('acacias--hub-module-left-col')) {
        const h2 = col.querySelector('h2');
        if (h2) return h2;
      }
    }
    return null;
  }

  // Helper to get the text and video content as separate columns
  function getTextAndVideoCols() {
    const contentCol = element.querySelector('.acacias--hub-module-content-area');
    if (!contentCol) return [null, null];
    const items = contentCol.querySelectorAll(':scope .acacias--content-item');
    let textCell = null;
    let videoCell = null;
    items.forEach(item => {
      if (item.querySelector('.cmp-text')) {
        textCell = item;
      } else if (item.querySelector('.acacias--comp-video-wrapper')) {
        // For video, replace iframe with a link
        const videoWrapper = item.cloneNode(true);
        const iframe = videoWrapper.querySelector('iframe');
        if (iframe && iframe.src) {
          const link = document.createElement('a');
          link.href = iframe.src;
          link.textContent = 'Video';
          iframe.replaceWith(link);
        }
        videoCell = videoWrapper;
      }
    });
    return [textCell, videoCell];
  }

  const headerRow = ['Columns (columns32)'];
  const leftCol = getTitleCol();
  const [textCol, videoCol] = getTextAndVideoCols();
  const contentRow = [leftCol, textCol, videoCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
