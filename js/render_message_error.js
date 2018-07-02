'use strict';
/**
 * Создает и добавляет на страницу DOM-элемент на основе шаблона, сообщение об ошибке.
 *
 * @param {string} messageError - текст сообщения об ошибке.
 */
window.renderMessageError = function (messageError) {
  var messageErrorTemplate = document.querySelector('#picture')
    .content
    .querySelector('.img-upload__message--error');
  var messageErrorElement = messageErrorTemplate.cloneNode(true);

  messageErrorElement.innerHTML = messageError;

  messageErrorElement.classList.remove('hidden');
  document.querySelector('.img-upload__form').appendChild(messageErrorElement);
};
