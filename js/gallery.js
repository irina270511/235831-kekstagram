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
  window.renderPreviewPicture = function (picture) {
    var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.picture__link');
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

    return pictureElement;
  };

  /**
   * Обработчик успешного события загрузки картинок с сервера. Перемешивает массив полученных с сервера данных(картинок) и вызывает функцию отрисовки элементов на странице.
   *
   * @param {array} data - массив данных (картинок), полученных с сервера.
   */
  var successHandler = function (data) {
    window.kekstagram.pictures = data;
    window.kekstagram.fn.renderElements(window.kekstagram.pictures, window.kekstagram.el.picturesSection, renderPreviewPicture);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
  };

  /**
   * Обработчик неуспешного события загрузки картинок с сервера. Вызывает функцию отрисовки сообщения об ошибке.
   *
   * @param {string} errorMessage - текст сообщения об ошибке.
   */
  var errorHandler = function (errorMessage) {
    window.kekstagram.fn.renderMessageError(errorMessage);
  };

  window.kekstagram.fn.download(successHandler, errorHandler);

})();
