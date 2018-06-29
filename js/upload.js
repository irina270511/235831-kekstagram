'use strict';
(function () {
  var uploadStartButton = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadOverlayCloseButton = document.querySelector('#upload-cancel');
  var ESC_KEYCODE = 27;

  /**
   * Закрывает окно загрузки картинок по нажатию ESC.
   *
   * @param {object} evt - объект event.
   */
  window.escUploadPressHandler = function (evt) {
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
    document.addEventListener('keydown', window.escUploadPressHandler);
    document.addEventListener('click', overlayUploadClickHandler);
  };

  /**
   * Закрывает окно загрузки фотографий.
   */
  var closeUploadOverlay = function () {
    uploadOverlay.classList.add('hidden');
    uploadStartButton.value = '';
    document.removeEventListener('keydown', window.escUploadPressHandler);
    document.removeEventListener('click', overlayUploadClickHandler);
  };

  uploadStartButton.addEventListener('change', function () {
    openUploadOverlay();
  });

  uploadOverlayCloseButton.addEventListener('click', function () {
    closeUploadOverlay();
  });


})();
