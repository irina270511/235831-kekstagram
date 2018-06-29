'use strict';
(function () {
  /**
   * Создает DOM-элемент на основе шаблона, превью картинки на главной странице.
   *
   * @param {object} picture - картинка с характеристиками.
   * @param {string} picture.url - путь к картинке.
   * @param {number} picture.likes - количество лайков к картинке.
   * @param {array} picture.comments - массив с комментариями к картинке.
   * @return {object} pictureElement - DOM-элемент на основе шаблона, превью картинки.
   */
  var renderPreviewPicture = function (picture) {
    var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture__link');
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.id = picture.id;
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

    return pictureElement;
  };

  renderElements(pictures, domElements.picturesSection, renderPreviewPicture);

})();
