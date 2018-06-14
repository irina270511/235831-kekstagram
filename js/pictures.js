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
 * Создает числовой массив от min до max (включительно) по возрастанию с шагом 1.
 *
 * @param {number} min - минимальное число массива. Любое число, может быть отрицательным и/или дробным.
 * @param {number} max - максимальное число массива. Любое число, может быть отрицательным и/или дробным. Должно быть больше или равно минимальному числу массива.
 * @return {array} numericArray - числовой массив от min до max (включительно).
 */
var createNumericArray = function (min, max) {
  var numericArray = [];
  for (var i = min; i <= max; i++) {
    numericArray.push(i);
  }
  return numericArray;
};

/**
 * Перемешивает массив случайным образом.
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
 * Генерирует список любой длины из возможных комментариев (COMMENTS).
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
 * Создает массив картинок любой длины. Параметры картинок: уникальный адрес, случайное количество лайков, случайный список комментариев и случайное описание.
 *
 * @param {number} picturesQuantity - количество картинок.
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
 * Удаляет на странице массив ненужных DOM-элементов.
 *
 * @param {array}  unusefulElements - массив ненужных элементов.
 * @param {object} place - место в DOM-дереве для удаления элементов.
 */
var removeElements = function (unusefulElements, place) {
  for (var i = 0; i < unusefulElements.length; i++) {
    place.removeChild(unusefulElements[i]);
  }
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
 * Создает фрагмент DOM-дерева (лист комментариев) на основе данных массива.
 *
 * @param {array} comments - массив комментариев.
 * @return {object} fragment - фрагмент DOM-дерева - лист комментариев.
 */
var renderCommentsList = function (comments) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < comments.length; i++) {
    var newElement = document.createElement('li');
    newElement.className = 'social__comment social__comment--text';
    newElement.innerHTML = '<img class="social__picture" src="img/avatar-' + Math.ceil(Math.random() * AVATAR_QUANTITY) + '.svg" alt="Аватар комментатора фотографии" width="35" height="35"> <p class="social__text">' + comments[i] + '</p>';
    fragment.appendChild(newElement);
  }
  return fragment;
};

/**
 * Отрисовывает на странице картинки (DOM-элементы) на основе данных массива.
 *
 * @param {array} pictures - массив картинок.
 * @param {object} place - место в DOM-дереве для добавления элементов.
 */
var drawPreviewPictures = function (pictures, place) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pictures.length; i++) {
    fragment.appendChild(renderPreviewPicture(pictures[i]));
  }
  place.appendChild(fragment);
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
var drawBigPicture = function (picture) {
  // Показываем страницу с картинкой в полном размере
  var bigPicture = document.querySelector('.big-picture');
  bigPicture.classList.remove('hidden');
  // Удаляем имеющиеся комментарии
  var unusefulSocialComments = bigPicture.querySelectorAll('.social__comment');
  var socialComments = bigPicture.querySelector('.social__comments');
  removeElements(unusefulSocialComments, socialComments);
  // Рендерим и вставляем новый лист с комментариями
  var pictureComments = renderCommentsList(picture.comments);
  socialComments.appendChild(pictureComments);
  // Вставляем остальные параметры картинки
  bigPicture.querySelector('.big-picture__img > img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;
};

var urlNumbers = createNumericArray(1, 25);
var randomUrlNumbers = randomizeArray(urlNumbers);
var likes = createNumericArray(15, 200);
var pictures = getPictures(25);

var place = document.querySelector('.pictures');
drawPreviewPictures(pictures, place);

drawBigPicture(pictures[0]);

document.querySelector('.social__comment-count')
        .classList
        .add('visually-hidden');

document.querySelector('.social__loadmore')
        .classList
        .add('visually-hidden');
