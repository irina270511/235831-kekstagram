'use strict';
(function () {
  var bigPictureOverlay = document.querySelector('.big-picture');
  var bigPictureOverlayCloseButton = document.querySelector('#picture-cancel');
  var socialCommentsUl = document.querySelector('.social__comments');
  // Количество доступных аватаров для комментаторов
  var AVATAR_QUANTITY = 6;

  var ESC_KEYCODE = 27;

  /**
   * Закрывает окно с картинкой в полном размере по нажатию ESC.
   *
   * @param {object} evt - объект event.
   */
  var escPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeBigPictureOverlay();
    }
  };

  /**
   * Создает DOM-элемент на основе шаблона, комментарий к картинке.
   *
   * @param {string} comment - текст комментария.
   * @return {object} commentElement - DOM-элемент на основе шаблона, комментарий к картинке.
   */
  var renderComment = function (comment) {
    var pictureTemplate = document.querySelector('#picture')
      .content
      .querySelector('.social__comment');
    var commentElement = pictureTemplate.cloneNode(true);

    commentElement.querySelector('.social__picture').src = 'img/avatar-' + Math.ceil(Math.random() * AVATAR_QUANTITY) + '.svg';
    commentElement.querySelector('.social__text').textContent = comment;

    return commentElement;
  };
  /**
   * Отрисовывает страницу с картинкой в полном размере.
   *
   * @param {object} picture - картинка с характеристиками.
   * @param {string} picture.url - путь к картинке.
   * @param {number} picture.likes - количество лайков к картинке.
   * @param {array} picture.comments - массив с комментариями к картинке.
   * @param {string} picture.description - описание к картинке.
   */
  var renderBigPicture = function (picture) {
    // Показываем страницу с картинкой в полном размере
    bigPictureOverlay.classList.remove('hidden');
    document.addEventListener('click', overlayBigPictureClickHandler);
    document.addEventListener('keydown', escPressHandler);
    // Рендерим и вставляем лист с комментариями
    window.renderElements(picture.comments, socialCommentsUl, renderComment);
    // Вставляем остальные параметры картинки
    bigPictureOverlay.querySelector('.big-picture__img > img').src = picture.url;
    bigPictureOverlay.querySelector('.likes-count').textContent = picture.likes;
    bigPictureOverlay.querySelector('.comments-count').textContent = picture.comments.length;
    bigPictureOverlay.querySelector('.social__caption').textContent = picture.description;
  };

  /**
   * Находит по переданному событию порядковый номер выбранной картинки в массиве картинок (pictures) и вызывает функцию отрисовки.
   *
   * @param {object} evt - объект event.
   */
  var findPicture = function (evt) {
    if (evt.target.parentNode.className === 'picture__link') {
      for (var i = 0; i < window.pictures.length; i++) {
        if (window.pictures[i].id === evt.target.parentNode.id) {
          renderBigPicture(window.pictures[i]);
        }
      }
    }
  };

  /**
   * Удаляет всех потомков переданного DOM-элемента
   *
   * @param {object} element - DOM-элемент (Element), потомков которого следует удалить.
   */
  var removeAllChildren = function (element) {
    var childList = element.childNodes;
    for (var i = 0; i < childList.length; i++) {
      element.removeChild(childList[i]);
    }
  };

  /**
   * Вызывает закрытие окна в полном размере при клике на поле overlayBigPicture, вне поля окна с картинкой
   *
   * @param {object} evt - объект event.
   */
  var overlayBigPictureClickHandler = function (evt) {
    if (evt.target === bigPictureOverlay) {
      closeBigPictureOverlay();
    }
  };

  /**
   * Закрывает окно с картинкой в полном размере, перед этим удаляя все комментарии под картинкой.
   */
  var closeBigPictureOverlay = function () {
    removeAllChildren(socialCommentsUl);
    bigPictureOverlay.classList.add('hidden');
    document.removeEventListener('click', overlayBigPictureClickHandler);
    document.removeEventListener('keydown', escPressHandler);
  };

  domElements.picturesSection.addEventListener('click', function (evt) {
    findPicture(evt);
  });

  bigPictureOverlayCloseButton.addEventListener('click', function () {
    closeBigPictureOverlay();
  });


  // Временно спрятанные счетчик комментариев и кнопка дальнейшей загрузки комментариев
  document.querySelector('.social__comment-count')
    .classList
    .add('visually-hidden');

  document.querySelector('.social__loadmore')
    .classList
    .add('visually-hidden');

})();
