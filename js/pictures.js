'use strict';

// Возможные комментарии
var COMMENTS = ['Все отлично!', 'В целом все неплохо. Но не все.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
// Возможные описания картинок
var DESCRIPTION = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
// Максимальное количество комментариев к каждой картинке
var COMMENTS_QUANTITY = 2;
// Количество доступных аватаров для комментаторов
var AVATAR_QUANTITY = 6;

/**
 * Создает числовой массив от min до max (включительно) по возрастанию с шагом step.
 *
 * @param {number} min - минимальное число массива. Любое число, может быть отрицательным и/или дробным.
 * @param {number} max - максимальное число массива. Любое число, может быть отрицательным и/или дробным. Должно быть больше или равно минимальному числу массива.
 * @param {number} step - шаг массива. Положительное число.
 * @return {array} numericArray - числовой массив от min до max (включительно).
 */
var rangeNumericArray = function (min, max, step) {
  var numericArray = [];
  for (var i = min; i <= max; i += step) {
    numericArray.push(i);
  }
  return numericArray;
};

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


var urlNumbers = rangeNumericArray(1, 25, 1);
var randomUrlNumbers = randomizeArray(urlNumbers);
var likes = rangeNumericArray(15, 200, 1);

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
      url: 'photos/' + randomUrlNumbers[i] + '.jpg',
      likes: getRandomElement(likes),
      comments: generateCommentsList(COMMENTS_QUANTITY),
      description: getRandomElement(DESCRIPTION)
    };
    pictures.push(photo);
  }
  return pictures;
};

/**
 * Создает DOM-элемент на основе шаблона, превью картинок на главной странице.
 *
 * @param {object} picture - картинка с характеристиками.
 * @param {string} picture.url - путь к картинке.
 * @param {number} picture.likes - количество лайков к картинке.
 * @param {array} picture.comments - массив с комментариями к картинке.
 * @return {object} pictureElement - DOM-элемент на основе шаблона, превью картинки.
 */
var renderPreviewPicture = function (picture) {
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture__link');
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

  return pictureElement;
};


/**
 * Создает DOM-элемент на основе шаблона, комментарий к картинке.
 *
 * @param {string} comment - текст комментария.
 * @return {object} commentElement - DOM-элемент на основе шаблона, комментарий к картинке.
 */
var renderComment = function (comment) {
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.social__comment');
  var commentElement = pictureTemplate.cloneNode(true);

  commentElement.querySelector('.social__picture').src = 'img/avatar-' + Math.ceil(Math.random() * AVATAR_QUANTITY) + '.svg';
  commentElement.querySelector('.social__text').textContent = comment;

  return commentElement;
};

/**
 * Отрисовывает на странице комментарии (DOM-элементы) на основе данных массива.
 *
 * @param {array} comments - массив комментариев.
 * @param {object} appendTo - место в DOM-дереве для добавления элементов.
 */
var renderCommentsList = function (comments, appendTo) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < comments.length; i++) {
    fragment.appendChild(renderComment(comments[i]));
  }
  appendTo.appendChild(fragment);
};

/**
 * Отрисовывает на странице картинки (DOM-элементы) на основе данных массива картинок.
 *
 * @param {array} pictures - массив картинок.
 * @param {object} appendTo - место в DOM-дереве для добавления элементов.
 */
var renderPreviewPicturesList = function (pictures, appendTo) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pictures.length; i++) {
    fragment.appendChild(renderPreviewPicture(pictures[i]));
  }
  appendTo.appendChild(fragment);
};

/**
 * Отрисовывает страницу с картинкой в полном размере.
 *
 * @param {object} picture - картинка с характеристиками.
 * @param {string} picture.url - путь к картинке.
 * @param {number} picture.likes - количество лайков к картинке.
 * @param {array} picture.comments - массив с комментариями к картинке.
 * @param {string} picture.description - описание к картинке.
 */
var renderBigPicture = function (picture) {
  // Показываем страницу с картинкой в полном размере
  var bigPicture = document.querySelector('.big-picture');
  bigPicture.classList.remove('hidden');
  // Рендерим и вставляем лист с комментариями
  var socialComments = bigPicture.querySelector('.social__comments');
  var pictureComments = renderCommentsList(picture.comments, socialComments);
  // Вставляем остальные параметры картинки
  bigPicture.querySelector('.big-picture__img > img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;
};

var pictures = getPictures(25);
var place = document.querySelector('.pictures');
renderPreviewPicturesList(pictures, place);

renderBigPicture(pictures[0]);

document.querySelector('.social__comment-count')
        .classList
        .add('visually-hidden');

document.querySelector('.social__loadmore')
        .classList
        .add('visually-hidden');
