const DATA_GROUP = 'data-group';
const DATA_NUMBER = 'data-number';

const getCyclerImage = () => document.getElementById('cycler-image');
const getItemImage = (groupIndex, itemIndex) =>
  document.querySelector(
    `.group__list[${DATA_GROUP}='${groupIndex}'] img[${DATA_NUMBER}='${itemIndex}']`
  );

/**
 * Update the cycler image element attributes
 *
 * @param {string} name image name
 * @param {string} image base64 image
 * @param {string} groupIndex
 * @param {string} itemIndex
 */
function updateImage(name, image, groupIndex, itemIndex) {
  console.log(name, image, groupIndex, itemIndex);
  const imgElement = getCyclerImage();
  imgElement.src = image;
  imgElement.alt = name;
  imgElement.setAttribute(DATA_GROUP, groupIndex);
  imgElement.setAttribute(DATA_NUMBER, itemIndex);
}

/**
 * Update element visibility
 *
 * @param {HTMLElement} element
 * @param {boolean} visible
 */
function setElementVisibility(element, visible) {
  element.style.cssText = `display: ${visible ? 'block' : 'none'};`;
  element.setAttribute('aria-hidden', !visible);
}

/**
 * Toggle between gallery and cycler modes
 *
 * @param {boolean} showCycler
 * @param {string} name image name
 * @param {string} image base64 image
 * @param {string} groupIndex
 * @param {string} itemIndex
 */
function updateCyclerState(
  showCycler,
  name = '',
  image = '',
  groupIndex = '',
  itemIndex = ''
) {
  document.body.style.cssText = `overflow: ${showCycler ? 'hidden' : 'auto'}`;

  const header = document.getElementById('header');
  setElementVisibility(header, !showCycler);

  const content = document.getElementById('content');
  setElementVisibility(content, !showCycler);

  const cycler = document.getElementById('cycler');
  setElementVisibility(cycler, showCycler);

  const groupTitleElement = document.querySelector(
    `.group__title[${DATA_GROUP}='${groupIndex}']`
  );

  const groupTitle = groupTitleElement ? groupTitleElement.textContent : '';

  const cyclerTitle = document.getElementById('cycler-title');
  cyclerTitle.textContent = showCycler
    ? `${groupTitle ? `${groupTitle}\\` : ''}${name}`
    : '';

  if (showCycler) {
    updateImage(name, image, groupIndex, itemIndex);
  }
}

/**
 * Create event listener for image changing button
 *
 * @param {number} direction
 */
function createImageChangeHandler(direction) {
  return () => {
    const imgElement = getCyclerImage();
    const gIdx = imgElement.getAttribute(DATA_GROUP);
    const idx = imgElement.getAttribute(DATA_NUMBER);
    const groupItems = document.querySelectorAll(
      `.group__list[${DATA_GROUP}='${gIdx}'] .item`
    );
    const lastIdx = groupItems.length - 1;

    let newIdx = Number(idx) + direction;
    newIdx = newIdx < 0 ? lastIdx : newIdx > lastIdx ? 0 : newIdx;

    const item = getItemImage(gIdx, newIdx);
    updateCyclerState(true, item.alt, item.src, gIdx, newIdx);
  };
}

/**
 * Create event listener for group changing button
 *
 * @param {number} direction
 */
function createGroupChangeHandler(direction) {
  return () => {
    const imgElement = getCyclerImage();
    const gIdx = imgElement.getAttribute(DATA_GROUP);
    const lastGroupIdx = document.querySelectorAll('.group').length - 1;
    let newGIdx = Number(gIdx) + direction;
    newGIdx = newGIdx < 0 ? lastGroupIdx : newGIdx > lastGroupIdx ? 0 : newGIdx;

    const item = getItemImage(newGIdx, 0);
    updateCyclerState(true, item.alt, item.src, newGIdx, 0);
  };
}

/**
 * Activate cycler mode
 *
 * @param {string} name image name
 * @param {string} image base64 image
 * @param {string} groupIndex
 * @param {string} itemIndex
 */
function setupCycler(name, image, groupIndex, itemIndex) {
  updateCyclerState(true, name, image, groupIndex, itemIndex);

  const prevGroup = document.getElementById('prevGroup');
  prevGroup.addEventListener('click', createGroupChangeHandler(-1));
  const nextGroup = document.getElementById('nextGroup');
  nextGroup.addEventListener('click', createGroupChangeHandler(1));

  const prevImage = document.getElementById('prevImage');
  prevImage.addEventListener('click', createImageChangeHandler(-1));
  const nextImage = document.getElementById('nextImage');
  nextImage.addEventListener('click', createImageChangeHandler(1));

  function handleClose() {
    updateCyclerState(false);
    prevGroup.removeEventListener('click', createGroupChangeHandler(-1));
    nextGroup.removeEventListener('click', createGroupChangeHandler(1));
    prevImage.removeEventListener('click', createImageChangeHandler(-1));
    nextImage.removeEventListener('click', createImageChangeHandler(1));
    closeBtn.removeEventListener('click', handleClose);
  }

  const closeBtn = document.getElementById('close');
  closeBtn.addEventListener('click', handleClose);
}

/**
 * Handle activation of cycler starting with event target
 *
 * @param {Event} event
 */
function onImageClick(event) {
  const t = event.target;

  const targetList = t.getAttribute(DATA_GROUP);
  const targetItem = t.getAttribute(DATA_NUMBER);
  const item = getItemImage(targetList, targetItem);

  setupCycler(item.alt, item.src, targetList, targetItem);
}

/**
 * Page setup
 */
function setup() {
  const buttons = document.querySelectorAll('.item__button');

  Array.from(buttons).forEach((btn) =>
    btn.addEventListener('click', onImageClick)
  );
}

setup();
