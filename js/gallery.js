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

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

    return pictureElement;
  };

  /**
   * Перемешивает массив случайным образом (алгоритм Фишера-Йетса).
   *
   * @param {array} arr - любой массив элементов.
   * @return {array} newArr - новый массив из тех же элементов в случайном порядке.
   */
  var randomizeArray = function (arr) {
    var arrLength = arr.length;
    var newArr = [];
    for (var i = 0; i < arrLength; i++) {
      var index = Math.floor(Math.random() * arr.length);
      newArr.push(arr[index]);
      arr.splice(index, 1);
    }
    return newArr;
  };

  /**
   * Обработчик успешного события загрузки картинок с сервера. Перемешивает массив полученных с сервера данных(картинок) и вызывает функцию отрисовки элементов на странице.
   *
   * @param {array} data - массив данных (картинок), полученных с сервера.
   */
  var successHandler = function (data) {
    window.pictures = randomizeArray(data);
    window.renderElements(window.pictures, window.domElements.picturesSection, renderPreviewPicture);
  };

  /**
   * Обработчик неуспешного события загрузки картинок с сервера. Вызывает функцию отрисовки сообщения об ошибке.
   *
   * @param {string} errorMessage - текст сообщения об ошибке.
   */
  var errorHandler = function (errorMessage) {
    window.renderMessageError(errorMessage);
  };

  window.download(successHandler, errorHandler);

})();
