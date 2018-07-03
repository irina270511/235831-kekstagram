'use strict';
(function () {
  var hashtagsInput = document.querySelector('input[name=hashtags]');
  var descriptionTextarea = document.querySelector('textarea[name=description]');
  var form = document.querySelector('.img-upload__form');

  var uploadStartButton = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadOverlayCloseButton = document.querySelector('#upload-cancel');
  var ESC_KEYCODE = 27;

  /**
   * Закрывает окно загрузки картинок по нажатию ESC.
   *
   * @param {KeyboardEvent} evt - объект Event.
   */
  var escUploadPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeUploadOverlay();
    }
  };

  /**
   * Вызывает закрытие окна загрузки при клике на поле overlayUpload, вне поля окна загрузки
   *
   * @param {MouseEvent} evt - объект Event.
   */
  var overlayUploadClickHandler = function (evt) {
    if (evt.target === uploadOverlay) {
      closeUploadOverlay();
    }
  };

  /**
   * Открывает окно загрузки фотографий.
   */
  var openUploadOverlay = function () {
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', escUploadPressHandler);
    document.addEventListener('click', overlayUploadClickHandler);
  };

  /**
   * Закрывает окно загрузки фотографий.
   */
  var closeUploadOverlay = function () {
    uploadOverlay.classList.add('hidden');
    uploadStartButton.value = '';
    document.removeEventListener('keydown', escUploadPressHandler);
    document.removeEventListener('click', overlayUploadClickHandler);
  };

  /**
   * Проверяет введенные хэштеги на соответствие заданным условиям. Если поле инпута пустое - проверка не осуществляется.
   * Проверяемые условия:
   * - нельзя указать больше пяти хэш-тегов;
   * - один и тот же хэш-тег не может быть использован дважды, при этом теги нечувствительны к регистру;
   * - хэш-тег начинается с символа # (решётка);
   * - хеш-тег не может состоять из одного символа;
   * - максимальная длина одного хэш-тега 20 символов, включая решётку.
   *
   * @param {object} input - инпут с введенными хэштегами.
   */
  var validateHashtags = function (input) {
    var hashtags = input.value;
    if (hashtags === '') {
      input.setCustomValidity('');
      return;
    }
    var hashtagsList = hashtags.split(' ');
    if (hashtagsList.length > 5) {
      input.setCustomValidity('Нельзя использовать больше 5 тегов');
    } else if (!window.kekstagram.util.checkRepeats(hashtagsList)) {
      input.setCustomValidity('Теги не должны повторяться. Теги нечувствительны к регистру: #ХэшТег и #хэштег считаются одним и тем же тегом');
    } else {
      for (var i = 0; i < hashtagsList.length; i++) {
        if (!(hashtagsList[i].indexOf('#') === 0)) {
          input.setCustomValidity('Тег должен начинаться с символа решетки (#)');
        } else if (hashtagsList[i].length < 2) {
          input.setCustomValidity('Тег не может быть короче двух символов');
        } else if (hashtagsList[i].length > 20) {
          input.setCustomValidity('Тег не может быть длиннее 20 символов');
        } else {
          input.setCustomValidity('');
        }
      }
    }
    return;
  };

  /**
   * Обработчик успешного события загрузки картинки на сервер. Закрывает окно загрузки.
   */
  var successHandler = function () {
    closeUploadOverlay();
  };

  /**
   * Обработчик неуспешного события загрузки картинки на сервер. Вызывает функцию отрисовки сообщения об ошибке и закрывает окно загрузки.
   *
   * @param {string} errorMessage - текст сообщения об ошибке.
   */
  var errorHandler = function (errorMessage) {
    window.kekstagram.fn.renderMessageError(errorMessage);
    closeUploadOverlay();
  };

  uploadStartButton.addEventListener('change', function () {
    openUploadOverlay();
  });

  uploadOverlayCloseButton.addEventListener('click', function () {
    closeUploadOverlay();
  });

  hashtagsInput.addEventListener('focus', function () {
    document.removeEventListener('keydown', escUploadPressHandler);
  });

  hashtagsInput.addEventListener('blur', function () {
    document.addEventListener('keydown', escUploadPressHandler);
    validateHashtags(hashtagsInput);
  });

  descriptionTextarea.addEventListener('focus', function () {
    document.removeEventListener('keydown', escUploadPressHandler);
  });

  descriptionTextarea.addEventListener('blur', function () {
    document.addEventListener('keydown', escUploadPressHandler);
  });

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.kekstagram.fn.upload(new FormData(form), successHandler, errorHandler);
  });

})();
