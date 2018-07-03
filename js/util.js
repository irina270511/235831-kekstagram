'use strict';

window.util = {
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
  }
};
