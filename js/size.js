'use strict';
(function () {
  // Размеры загружаемых фотографий (в %)
  var MAX_SIZE = 100;
  var MIN_SIZE = 25;
  // Шаг изменения размера загружаемых фотографий (в %)
  var SIZE_CHANGE_STEP = 25;

  var sizeMinusButton = document.querySelector('.resize__control--minus');
  var sizePlusButton = document.querySelector('.resize__control--plus');

  /**
   * Меняет размер картинки, в зависимости от входных данных - уменьшает или увеличивает.
   *
   * @param {boolean} sizeUp - true: размер увеличивается, false: размер уменьшается.
   * @param {object} img - DOM-элемент, картинка, размер которой изменяется.
   * @param {object} input - DOM-элемент, отображающий текущий размер картинки.
   */
  var resizeValue = function (sizeUp, img, input) {
    var pictureSize = +(input.value).replace('%', '');
    if (sizeUp && pictureSize < MAX_SIZE) {
      pictureSize += SIZE_CHANGE_STEP;
    } else if (!sizeUp && pictureSize > MIN_SIZE) {
      pictureSize -= SIZE_CHANGE_STEP;
    }
    img.style.transform = 'scale(' + pictureSize / 100 + ')';
    input.value = pictureSize + '%';
  };

  sizePlusButton.addEventListener('click', function () {
    resizeValue(true, domElements.uploadPreviewImg, domElements.sizeValueInput);
  });

  sizeMinusButton.addEventListener('click', function () {
    resizeValue(false, domElements.uploadPreviewImg, domElements.sizeValueInput);
  });

})();
