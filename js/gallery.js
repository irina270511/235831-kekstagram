'use strict';
(function () {
  /**
   * Обработчик успешного события загрузки картинок с сервера. Перемешивает массив полученных с сервера данных(картинок) и вызывает функцию отрисовки элементов на странице.
   *
   * @param {array} data - массив данных (картинок), полученных с сервера.
   */
  var successHandler = function (data) {
    window.kekstagram.pictures = data;
    window.kekstagram.fn.renderElements(window.kekstagram.pictures, window.kekstagram.el.picturesSection, window.kekstagram.fn.renderPreviewPicture);
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
