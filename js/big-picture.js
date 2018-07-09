'use strict';
(function () {
  var body = document.querySelector('body');
  var bigPictureOverlay = document.querySelector('.big-picture');
  var bigPictureOverlayCloseButton = document.querySelector('#picture-cancel');
  var socialCommentsUl = document.querySelector('.social__comments');
  var currentCommentsCount = document.querySelector('.current-comments-count');
  var loadMoreButton = document.querySelector('.social__loadmore');
  // Количество доступных аватаров для комментаторов
  var AVATAR_QUANTITY = 6;
  var ESC_KEYCODE = 27;
  var COMMENTS_QUANTITY = 5;
  var commentsCounter;
  /**
   * Показывает спрятанные комментарии, убирая у них класс 'visually-hidden'.
   * Обновляет данные счетчика комментариев, который показан на странице.
   *
   * @param {number} quantity - максимальное количество комментариев, которое необходимо показать. Может превышать количество существующих комментариев.
   */
  var showComments = function (quantity) {
    var comments = document.querySelectorAll('.social__comment');
    comments.forEach(function (item, index) {
      if (index < quantity & item.classList.contains('visually-hidden')) {
        item.classList.remove('visually-hidden');
      }
    });

    if (quantity < comments.length) {
      currentCommentsCount.textContent = quantity;
    } else {
      currentCommentsCount.textContent = comments.length;
      loadMoreButton.classList.add('hidden');
    }
  };

  /**
   * Обработчик клика на кнопке "загрузить еще". Считает необходимое количество комментариев и вызывает их открытие.
   */
  var loadMoreButtonClickHandler = function () {
    commentsCounter += COMMENTS_QUANTITY;
    showComments(commentsCounter);
  };

  /**
   * Открывает окно с картинкой в полном размере.
   */
  var openBigPictureOverlay = function () {
    body.classList.add('modal-open');
    bigPictureOverlay.classList.remove('hidden');
    document.addEventListener('click', overlayBigPictureClickHandler);
    document.addEventListener('keydown', escPressHandler);
    commentsCounter = COMMENTS_QUANTITY;
    loadMoreButton.classList.remove('hidden');
    loadMoreButton.addEventListener('click', loadMoreButtonClickHandler);
  };

  /**
   * Закрывает окно с картинкой в полном размере, перед этим удаляя все комментарии под картинкой.
   */
  var closeBigPictureOverlay = function () {
    window.kekstagram.util.removeAllChildren(socialCommentsUl);
    body.classList.remove('modal-open');
    bigPictureOverlay.classList.add('hidden');
    bigPictureOverlay.querySelector('.big-picture__img > img').src = '';
    document.removeEventListener('click', overlayBigPictureClickHandler);
    document.removeEventListener('keydown', escPressHandler);
    loadMoreButton.removeEventListener('click', loadMoreButtonClickHandler);
  };

  /**
   * Закрывает окно с картинкой в полном размере по нажатию ESC.
   *
   * @param {KeyboardEvent} evt - объект Event.
   */
  var escPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeBigPictureOverlay();
    }
  };

  /**
   * Вызывает закрытие окна в полном размере при клике на поле overlayBigPicture, вне поля окна с картинкой
   *
   * @param {MouseEvent} evt - объект Event.
   */
  var overlayBigPictureClickHandler = function (evt) {
    if (evt.target === bigPictureOverlay) {
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
    openBigPictureOverlay();

    window.kekstagram.fn.renderElements(picture.comments, socialCommentsUl, renderComment);
    showComments(COMMENTS_QUANTITY);

    bigPictureOverlay.querySelector('.big-picture__img > img').src = picture.url;
    bigPictureOverlay.querySelector('.likes-count').textContent = picture.likes;
    bigPictureOverlay.querySelector('.comments-count').textContent = picture.comments.length;
    bigPictureOverlay.querySelector('.social__caption').textContent = picture.description;
  };

  /**
   * Находит выбранную картинку (путем сравнения url) и вызывает функцию отрисовки картинки в полном размере.
   *
   * @param {object} evtTarget - (evt.target) текущий выбранный элемент.
   * @param {string} evtTarget.parentNode.className - класс родителя выбранного элемента.
   * @param {string} evtTarget.src - путь к выбранному элемент.
   */
  var renderPicture = function (evtTarget) {
    if (evtTarget.parentNode.className === 'picture__link') {
      var regexp = /(photos)\/\d+\.jpg$/;
      var pictureUrl = regexp.exec(evtTarget.src)[0];
      var pictures = window.kekstagram.pictures;

      for (var i = 0; i < pictures.length; i++) {
        if (pictures[i].url === pictureUrl) {
          renderBigPicture(pictures[i]);
          break;
        }
      }
    }
  };

  window.kekstagram.el.picturesSection.addEventListener('click', function (evt) {
    renderPicture(evt.target);
  });

  bigPictureOverlayCloseButton.addEventListener('click', function () {
    closeBigPictureOverlay();
  });

})();
