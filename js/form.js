'use strict';
(function () {
  var hashtagsInput = document.querySelector('input[name=hashtags]');
  var descriptionTextarea = document.querySelector('textarea[name=description]');

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

})();
