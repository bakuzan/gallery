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

  const groupTitle = groupTitleElement
    ? groupTitleElement.firstElementChild.textContent
    : '';

  const cyclerTitle = document.getElementById('cycler-title');
  cyclerTitle.textContent = showCycler
    ? `${groupTitle ? `${groupTitle}\\` : ''}${name}`
    : '';

  if (showCycler) {
    updateImage(name, image, groupIndex, itemIndex);
  }
}

/**
 * Create event listener for changer button
 *
 * @param {number} direction
 */
function createChangeHandler(getIndexes) {
  return () => {
    const imgElement = getCyclerImage();
    const gIdx = imgElement.getAttribute(DATA_GROUP);
    const idx = imgElement.getAttribute(DATA_NUMBER);
    const [newGroupIndex, newItemIndex] = getIndexes(gIdx, idx);
    const item = getItemImage(newGroupIndex, newItemIndex);

    updateCyclerState(true, item.alt, item.src, newGroupIndex, newItemIndex);
  };
}

/**
 * Create index generator for next group selection
 *
 * @param {number} direction
 */
function getNewGroupIndex(direction) {
  return (gIdx) => {
    const lastGroupIdx = document.querySelectorAll('.group').length - 1;

    let newGIdx = Number(gIdx) + direction;
    newGIdx = newGIdx < 0 ? lastGroupIdx : newGIdx > lastGroupIdx ? 0 : newGIdx;
    return [newGIdx, 0];
  };
}

/**
 * Create index generator for next item selection
 *
 * @param {number} direction
 */
function getNewItemIndex(direction) {
  return (gIdx, idx) => {
    const lastIdx =
      document.querySelectorAll(`.group__list[${DATA_GROUP}='${gIdx}'] .item`)
        .length - 1;

    let newIdx = Number(idx) + direction;
    newIdx = newIdx < 0 ? lastIdx : newIdx > lastIdx ? 0 : newIdx;
    return [gIdx, newIdx];
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

  const onPrevGroup = createChangeHandler(getNewGroupIndex(-1));
  const onNextGroup = createChangeHandler(getNewGroupIndex(1));
  const onPrevImage = createChangeHandler(getNewItemIndex(-1));
  const onNextImage = createChangeHandler(getNewItemIndex(1));

  const prevGroup = document.getElementById('prevGroup');
  prevGroup.addEventListener('click', onPrevGroup);
  const nextGroup = document.getElementById('nextGroup');
  nextGroup.addEventListener('click', onNextGroup);

  const prevImage = document.getElementById('prevImage');
  prevImage.addEventListener('click', onPrevImage);
  const nextImage = document.getElementById('nextImage');
  nextImage.addEventListener('click', onNextImage);

  function handleClose() {
    updateCyclerState(false);
    prevGroup.removeEventListener('click', onPrevGroup);
    nextGroup.removeEventListener('click', onNextGroup);
    prevImage.removeEventListener('click', onPrevImage);
    nextImage.removeEventListener('click', onNextImage);
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
  Array.from(document.querySelectorAll('.item__button')).forEach((btn) =>
    btn.addEventListener('click', onImageClick)
  );
}

setup();
