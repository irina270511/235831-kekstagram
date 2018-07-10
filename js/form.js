'use strict';
(function () {
  var hashtagsInput = document.querySelector('input[name=hashtags]');
  var descriptionTextarea = document.querySelector('textarea[name=description]');
  var form = document.querySelector('.img-upload__form');
  var uploadStartButton = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadOverlayCloseButton = document.querySelector('#upload-cancel');
  var ESC_KEYCODE = 27;
  var MAX_HASHTAG_QUANTITY = 5;
  var MAX_HASHTAG_SIZE = 20;
  var MIN_HASHTAG_SIZE = 2;
  var FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

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

  var inputHandler = function () {
    if (hashtagsInput.value === '') {
      hashtagsInput.setCustomValidity('');
    } else {
      validateHashtags(hashtagsInput);
    }
  };

  /**
   * Открывает окно загрузки фотографий.
   */
  var openUploadOverlay = function () {
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', escUploadPressHandler);
    document.addEventListener('click', overlayUploadClickHandler);
    hashtagsInput.addEventListener('keyup', inputHandler);

  };

  /**
   * Закрывает окно загрузки фотографий.
   */
  var closeUploadOverlay = function () {
    uploadOverlay.classList.add('hidden');
    form.reset();
    window.kekstagram.fn.clearStyle();
    document.removeEventListener('keydown', escUploadPressHandler);
    document.removeEventListener('click', overlayUploadClickHandler);
    hashtagsInput.removeEventListener('keyup', inputHandler);
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
    if (hashtagsList.length > MAX_HASHTAG_QUANTITY) {
      input.setCustomValidity('Нельзя использовать больше 5 тегов');
    } else if (!window.kekstagram.util.checkRepeats(hashtagsList)) {
      input.setCustomValidity('Теги не должны повторяться. Теги нечувствительны к регистру: #ХэшТег и #хэштег считаются одним и тем же тегом');
    } else {
      for (var i = 0; i < hashtagsList.length; i++) {
        if (!(hashtagsList[i].indexOf('#') === 0)) {
          input.setCustomValidity('Тег должен начинаться с символа решетки (#)');
        } else if (hashtagsList[i].length < MIN_HASHTAG_SIZE) {
          input.setCustomValidity('Тег не может быть короче ' + MIN_HASHTAG_SIZE + ' символов');
        } else if (hashtagsList[i].length > MAX_HASHTAG_SIZE) {
          input.setCustomValidity('Тег не может быть длиннее ' + MAX_HASHTAG_SIZE + ' символов');
        } else {
          input.setCustomValidity('');
        }
      }
    }
    return;
  };

  /**
   * Проверяет тип переданного файла на совпадение с одним из допустимых типов файла.
   *
   * @param {object} file - загружаемый файл.
   * @param {string} file.type - тип файла.
   * @return {boolean} file - возвращает true, если совпадение найдено, иначе - false.
   */
  var validateFileType = function (file) {
    for (var i = 0; i < FILE_TYPES.length; i++) {
      if (file.type === FILE_TYPES[i]) {
        return true;
      }
    }
    return false;
  };

  /**
   * Перебирает загружаемые файлы, если типы файлов не совпадают с допустимыми - выдает сообщение об ошибке.
   *
   * @param {array} files - массив объектов - загружаемые файлов.
   */
  var validateFiles = function (files) {
    for (var i = 0; i < files.length; i++) {
      if (!validateFileType(files[i])) {
        uploadStartButton.setCustomValidity('Вы можете загружать только изображения с форматами .png, .jpg, .jpeg');
      } else {
        uploadStartButton.setCustomValidity('');
      }
    }
  };

  /**
   * Обработчик успешного события загрузки картинки на сервер. Вызывает закрытие окна загрузки.
   */
  var successHandler = function () {
    closeUploadOverlay();
  };

  /**
   * Обработчик неуспешного события загрузки картинки на сервер. Вызывает функцию отрисовки сообщения об ошибке и закрытие окна загрузки.
   *
   * @param {string} errorMessage - текст сообщения об ошибке.
   */
  var errorHandler = function (errorMessage) {
    window.kekstagram.fn.renderMessageError(errorMessage);
    closeUploadOverlay();
  };

  uploadStartButton.addEventListener('change', function () {
    openUploadOverlay();
    validateFiles(uploadStartButton.files);
  });

  uploadOverlayCloseButton.addEventListener('click', function () {
    closeUploadOverlay();
  });

  hashtagsInput.addEventListener('focus', function () {
    document.removeEventListener('keydown', escUploadPressHandler);
  });

  hashtagsInput.addEventListener('blur', function () {
    document.addEventListener('keydown', escUploadPressHandler);
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
