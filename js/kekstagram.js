'use strict';

window.kekstagram = {
  el: {
    uploadPreviewImg: document.querySelector('.img-upload__preview'), // effect.js + size.js
    sizeValueInput: document.querySelector('.resize__control--value'), // effect.js + size.js
    picturesSection: document.querySelector('.pictures') // gallery.js + big_picture.js
  },

  fn: {
    /**
     * Создает и добавляет на страницу DOM-элемент на основе шаблона, сообщение об ошибке.
     *
     * @param {string} messageError - текст сообщения об ошибке.
     */
    renderMessageError: function (messageError) {
      var messageErrorTemplate = document.querySelector('#picture')
        .content
        .querySelector('.img-upload__message--error');
      var messageErrorElement = messageErrorTemplate.cloneNode(true);

      messageErrorElement.innerHTML = messageError;

      messageErrorElement.classList.remove('hidden');
      document.querySelector('.img-upload__form').appendChild(messageErrorElement);
    },

    /**
     * Добавляет на страницу DOM-элементы на основе данных массива.
     *
     * @param {array} elements - массив элементов.
     * @param {object} appendTo - место в DOM-дереве для добавления элементов.
     * @param {function} renderFunction - функция, которая отрисовывает каждый элемент массива.
     */
    renderElements: function (elements, appendTo, renderFunction) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < elements.length; i++) {
        fragment.appendChild(renderFunction(elements[i]));
      }
      appendTo.appendChild(fragment);
    }
  },

  util: {
    /**
     * Удаляет всех потомков переданного DOM-элемента
     *
     * @param {object} element - DOM-элемент (Element), потомков которого следует удалить.
     */
    removeAllChildren: function (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    },

    /**
     * Проверяет отсутствие повторов в строковом массиве, без учета регистра. Если повторов нет - возвращает true, иначе - false.
     * Функция основана на сравнении длины массива и объекта, имена свойств которого - элементы массива. Свойства объекта повторяться не могут, и это гарантирует, что повторяющиеся элементы массива не станут новыми свойствами объекта.
     *
     * @param {array} arr - массив строк.
     * @return {boolean} true||false - если повторов нет - возвращает true, иначе - false.
     */
    checkRepeats: function (arr) {
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
    },

    /**
     * Перемешивает массив случайным образом (алгоритм Фишера-Йетса).
     *
     * @param {array} arr - любой массив элементов.
     * @return {array} newArr - новый массив из тех же элементов в случайном порядке.
     */
    randomizeArray: function (arr) {
      var arrLength = arr.length;
      var newArr = [];
      for (var i = 0; i < arrLength; i++) {
        var index = Math.floor(Math.random() * arr.length);
        newArr.push(arr[index]);
        arr.splice(index, 1);
      }
      return newArr;
    },

    /**
     * Функция "устранение дребезга". Если после вызова переданной функции успел пройти заданный временной интервал, переданная функция исполнится.
     *
     * @param {function} fn - функция, которая должна быть вызвана.
     * @param {number} interval - временной интервал.
     * @return {function} function - исполнение функции.
     */
    debounce: function (fn, interval) {
      var lastTimeout = null;

      return function() {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function() {
          fn.apply(null, args);
        }, interval);
      };
    }
  }
};

