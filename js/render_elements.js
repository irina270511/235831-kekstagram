'use strict';
/**
 * Добавляет на страницу DOM-элементы на основе данных массива.
 *
 * @param {array} elements - массив элементов.
 * @param {object} appendTo - место в DOM-дереве для добавления элементов.
 * @param {function} renderFunction - функция, которая отрисовывает каждый элемент массива.
 */
window.renderElements = function (elements, appendTo, renderFunction) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < elements.length; i++) {
    fragment.appendChild(renderFunction(elements[i]));
  }
  appendTo.appendChild(fragment);
};
