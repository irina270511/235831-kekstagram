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
  }
}

