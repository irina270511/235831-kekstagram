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
   * @param {object} evt - объект event.
   */
  var escUploadPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeUploadOverlay();
    }
  };

  /**
   * Вызывает закрытие окна загрузки при клике на поле overlayUpload, вне поля окна загрузки
   *
   * @param {object} evt - объект event.
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
   * Проверяет отсутствие повторов в строковом массиве, без учета регистра. Если повторов нет - возвращает true, иначе - false.
   * Функция основана на сравнении длины массива и объекта, имена свойств которого - элементы массива. Свойства объекта повторяться не могут, и это гарантирует, что повторяющиеся элементы массива не станут новыми свойствами объекта.
   *
   * @param {array} arr - массив строк.
   * @return {boolean} true||false - если повторов нет - возвращает true, иначе - false.
   */
  var checkRepeats = function (arr) {
    var noRepeats = {};
    for (var i = 0; i < arr.length; i++) {
      var str = arr[i].toLowerCase();
      noRepeats[str] = true;
    }
    if (Object.keys(noRepeats).length === arr.length) {
      return true;
    } else {
      return false;
    }
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
    } else if (!checkRepeats(hashtagsList)) {
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
   * Создает DOM-элемент на основе шаблона, сообщение об ошибке.
   *
   * @param {string} messageError - текст сообщения об ошибке.
   * @return {object} commentElement - DOM-элемент на основе шаблона, сообщение об ошибке.
   */
  var renderMessageError = function (messageError) {
    var messageErrorTemplate = document.querySelector('#picture')
      .content
      .querySelector('.img-upload__message--error');
    var messageErrorElement = messageErrorTemplate.cloneNode(true);

    messageErrorElement.innerHTML = messageError;

    messageErrorElement.classList.remove('hidden');
    form.appendChild(messageErrorElement);
  };

  /**
   * Обработчик успешного события загрузки картинки на сервер. Закрывает окно загрузки.
   */
  var successHandler = function () {
    closeUploadOverlay();
  };

  /**
   * Обработчик неуспешного события загрузки картинки на сервер. Вызывает функция отрисовки сообщения об ошибке и закрывает окно загрузки.
   *
   * @param {string} error - текст сообщения об ошибке.
   */
  var errorHandler = function (error) {
    renderMessageError(error);
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
    window.upload(new FormData(form), successHandler, errorHandler);
  });

})();
