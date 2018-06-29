'use strict';
(function () {
  // Возможные комментарии
  var COMMENTS = ['Все отлично!', 'В целом все неплохо. Но не все.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
  // Возможные описания картинок
  var DESCRIPTION = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
  // Максимальное количество комментариев к каждой картинке
  var COMMENTS_QUANTITY = 2;
  // Количество картинок в галерее
  var PICTURES_QUANTITY = 25;

  /**
   * Создает числовой массив от min до max (включительно) по возрастанию с шагом step.
   *
   * @param {number} min - минимальное число массива. Любое число, может быть отрицательным и/или дробным.
   * @param {number} max - максимальное число массива. Любое число, может быть отрицательным и/или дробным. Должно быть больше или равно минимальному числу массива.
   * @param {number} step - шаг массива. Положительное число.
   * @return {array} range - числовой массив от min до max (включительно).
   */
  var generateRange = function (min, max, step) {
    var range = [];
    for (var i = min; i <= max; i += step) {
      range.push(i);
    }
    return range;
  };

  var likes = generateRange(15, 200, 1);
  var urlNumbers = generateRange(1, 25, 1);

  /**
   * Перемешивает массив случайным образом (алгоритм Фишера-Йетса).
   *
   * @param {array} arr - любой массив элементов.
   * @return {array} newArr - новый массив из тех же элементов в случайном порядке.
   */
  var randomizeArray = function (arr) {
    var arrLength = arr.length;
    var newArr = [];
    for (var i = 0; i < arrLength; i++) {
      var index = Math.floor(Math.random() * arr.length);
      newArr.push(arr[index]);
      arr.splice(index, 1);
    }
    return newArr;
  };

  var randomUrlNumbers = randomizeArray(urlNumbers);

  /**
   * Выдает случайный элемент из массива. Допустимы повторы.
   *
   * @param {array} arr - любой массив элементов.
   * @return {string} randomElement - случайный элемент из входящего массива.
   */
  var getRandomElement = function (arr) {
    var index = Math.floor(Math.random() * arr.length);
    var randomElement = arr[index];
    return randomElement;
  };

  /**
   * Генерирует массив заданной длины из возможных комментариев (COMMENTS).
   *
   * @param {number} quantity - количество комментариев.
   * @return {array} commentsList - массив из комментариев.
   */
  var generateCommentsList = function (quantity) {
    var commentsList = [];
    var commentsListLength = Math.ceil(Math.random() * quantity);
    for (var i = 0; i < commentsListLength; i++) {
      var comment = getRandomElement(COMMENTS);
      commentsList.push(comment);
    }
    return commentsList;
  };

  /**
   * Создает массив картинок заданной длины. Параметры картинок: уникальный адрес, случайное количество лайков, случайный список комментариев и случайное описание.
   *
   * @param {number} picturesQuantity - количество картинок (длина массива).
   * @return {array} pictures - массив картинок.
   */
  var getPictures = function (picturesQuantity) {
    var pictures = [];
    for (var i = 0; i < picturesQuantity; i++) {
      var photo = {
        id: 'picture_link_' + i,
        url: 'photos/' + randomUrlNumbers[i] + '.jpg',
        likes: getRandomElement(likes),
        comments: generateCommentsList(COMMENTS_QUANTITY),
        description: getRandomElement(DESCRIPTION)
      };
      pictures.push(photo);
    }
    return pictures;
  };

  //window.pictures = getPictures(PICTURES_QUANTITY);

})();
