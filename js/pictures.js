'use strict';

// Возможные комментарии
var COMMENTS = ['Все отлично!', 'В целом все неплохо. Но не все.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
// Возможные описания картинок
var DESCRIPTION = ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......', 'Вот это тачка!'];
// Максимальное количество комментариев к каждой картинке
var COMMENTS_QUANTITY = 2;
// Количество доступных аватаров для комментаторов
var AVATAR_QUANTITY = 6;
// Клавиатурные коды
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
// Размеры загружаемых фотографий (в %)
var MAX_SIZE = 100;
var MIN_SIZE = 25;
// Шаг изменения размера загружаемых фотографий (в %)
var MINUS_SIZE_STEP = -25;
var PLUS_SIZE_STEP = 25;
// Максимальная координата (по оси Х) шкалы изменения глубины эффекта фотографии
var MAX_COORDINATE_X = 100;
// Эффекты, применимые к загружаемым фотографиям
var effectNumber = 1;
var effects = {
  original: {
    effectId: 'effect-none',
    imgClass: 'effects__preview--none'
  },
  chrome: {
    effectId: 'effect-chrome',
    imgClass: 'effects__preview--chrome',
    filter: 'filter: grayscale(' + effectNumber + ');'
  },
  sepia: {
    effectId: 'effect-sepia',
    imgClass: 'effects__preview--sepia',
    filter: 'filter: sepia(' + effectNumber + ');'
  },
  marvin: {
    effectId: 'effect-marvin',
    imgClass: 'effects__preview--marvin',
    filter: 'filter: invert(' + effectNumber + '%);'
  },
  phobos : {
    effectId: 'effect-phobos',
    imgClass: 'effects__preview--phobos',
    filter: 'filter: blur(' + effectNumber + 'px);'
  },
  heat : {
    effectId: 'effect-heat',
    imgClass: 'effects__preview--heat',
    filter: 'filter: brightness(' + effectNumber + ');'
  }
};

// DOM-элементы
var bigPictureOverlay = document.querySelector('.big-picture');
var bigPictureOverlayCloseButton = document.querySelector('#picture-cancel');

var socialCommentsUl = document.querySelector('.social__comments');

var uploadStartButton = document.querySelector('#upload-file');
var uploadPreviewImg = document.querySelector('.img-upload__preview');
var uploadOverlay = document.querySelector('.img-upload__overlay');
var uploadOverlayCloseButton = document.querySelector('#upload-cancel');

var sizeMinusButton = document.querySelector('.resize__control--minus');
var sizePlusButton = document.querySelector('.resize__control--plus');
var sizeValueInput = document.querySelector('.resize__control--value');

var uploadScaleImg = document.querySelector('.img-upload__scale');
var scaleValueInput = document.querySelector('.scale__value');
var scalePin = document.querySelector('.scale__pin');

var effectsListUl = document.querySelector('.effects__list');

var picturesSection = document.querySelector('.pictures');

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
      url: 'photos/' + randomUrlNumbers[i] + '.jpg',
      likes: getRandomElement(likes),
      comments: generateCommentsList(COMMENTS_QUANTITY),
      description: getRandomElement(DESCRIPTION)
    };
    pictures.push(photo);
  }
  return pictures;
};

var pictures = getPictures(25);

/**
 * Создает DOM-элемент на основе шаблона, превью картинки на главной странице.
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
 * Добавляет на страницу DOM-элементы на основе данных массива.
 *
 * @param {array} elements - массив элементов.
 * @param {object} appendTo - место в DOM-дереве для добавления элементов.
 * @param {function} renderFunction - функция, которая отрисовывает каждый элемент массива.
 */
var renderElements = function (elements, appendTo, renderFunction) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < elements.length; i++) {
    fragment.appendChild(renderFunction(elements[i]));
  }
  appendTo.appendChild(fragment);
};

renderElements(pictures, picturesSection, renderPreviewPicture);


// КАРТИНКА В ПОЛНОМ РАЗМЕРЕ

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
  bigPictureOverlay.classList.remove('hidden');
  // Рендерим и вставляем лист с комментариями
  renderElements(picture.comments, socialCommentsUl, renderComment);
  // Вставляем остальные параметры картинки
  bigPictureOverlay.querySelector('.big-picture__img > img').src = picture.url;
  bigPictureOverlay.querySelector('.likes-count').textContent = picture.likes;
  bigPictureOverlay.querySelector('.comments-count').textContent = picture.comments.length;
  bigPictureOverlay.querySelector('.social__caption').textContent = picture.description;
};

/**
 * Находит порядковый номер выбранной картинки в массиве картинок (pictures), при помощи сравнения путей к каждой картинке и пути к выбранному элементу.
 * Если пути совпадают - вызывается функция отрисовки картинки в полном размере.
 *
 * @param {string} src - путь к выбранному элементу.
 */
var findPictureNumber = function (src) {
  var startPos = src.indexOf('photos');
  var pictureUrl = src.slice(startPos);
  for (var i = 0; i < pictures.length; i++) {
    if (pictures[i].url === pictureUrl) {
      renderBigPicture(pictures[i]);
    }
  }
};

var pictureLinks = document.querySelectorAll('.picture__link');

for (var i = 0; i < pictureLinks.length; i++) {
  pictureLinks[i].addEventListener('click', function (evt) {
    findPictureNumber(evt.target.src);
  })
};

/**
 * Удаляет всех потомков переданного DOM-элемента
 *
 * @param {object} element - DOM-элемент, потомков которого следует удалить.
 */
var removeAllChildren = function (element) {
  var childList = element.childNodes;
  for (var i = 0; i < childList.length; i++) {
    element.removeChild(childList[i]);
  }
};

/**
 * Закрывает окно с картинкой в полном размере, перед этим удаляя все комментарии под картинкой.
 */
var closeBigPictureOverlay = function () {
  removeAllChildren(socialCommentsUl);
  bigPictureOverlay.classList.add('hidden');
};

bigPictureOverlayCloseButton.addEventListener('click', function () {
  closeBigPictureOverlay();
});

bigPictureOverlayCloseButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeBigPictureOverlay();
  }
});

// Временно спрятанные счетчик комментариев и кнопка дальнейшей загрузки комментариев
document.querySelector('.social__comment-count')
  .classList
  .add('visually-hidden');

document.querySelector('.social__loadmore')
  .classList
  .add('visually-hidden');


// ЗАГРУЗКА КАРТИНОК

/**
 * Закрывает окно загрузки картинок по нажатию ESC.
 *
 * @param {object} evt - объект event.
 */
var escUploadPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    uploadOverlay.classList.add('hidden');
    uploadStartButton.value = '';
  }
};

/**
 * Открывает окно загрузки фотографий.
 */
var openUploadOverlay = function () {
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', escUploadPressHandler);
};

/**
 * Закрывает окно загрузки фотографий.
 */
var closeUploadOverlay = function () {
  uploadOverlay.classList.add('hidden');
  uploadStartButton.value = '';
  document.removeEventListener('keydown', escUploadPressHandler);

};

uploadStartButton.addEventListener('change', function () {
  openUploadOverlay();
});

uploadOverlayCloseButton.addEventListener('click', function () {
  closeUploadOverlay();
});

uploadOverlayCloseButton.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeUploadOverlay();
  }
});


// ИЗМЕНЕНИЕ РАЗМЕРА КАРТИНКИ

/**
 * Меняет значение поля изменения размера картинки (.resize__control--value).
 *
 * @param {number} sizeValue - переданный размер картинки.
 */
var changeSizeValueInput = function (sizeValue) {
  sizeValueInput.value = sizeValue + '%';
};

/**
 * Меняет размер превью картинки на переданное значение.
 *
 * @param {number} sizeValue - переданный размер картинки.
 */
var changeUploadPreviewStyle = function (sizeValue) {
  var valueForTransform = sizeValue / 100;
  uploadPreviewImg.style = "transform: scale(" + valueForTransform + ")";
};

/**
 * Вычисляет новый размер картинки, вызывает функции изменения размера картинки.
 *
 * @param {number} sizeStep - переданный шаг изменения размера.
 */
var resizeValue = function (sizeStep) {
  var pictureSize = + (sizeValueInput.value).replace('%', '');
  if ((sizeStep > 0 && pictureSize < MAX_SIZE) || (sizeStep < 0 && pictureSize > MIN_SIZE)) {
    var newPictureSize = pictureSize + sizeStep;
    changeSizeValueInput(newPictureSize);
    changeUploadPreviewStyle(newPictureSize);
  }
};

sizePlusButton.addEventListener('click', function () {
  resizeValue(PLUS_SIZE_STEP);
});

sizeMinusButton.addEventListener('click', function () {
  resizeValue(MINUS_SIZE_STEP);
});


// ИЗМЕНЕНИЕ ЭФФЕКТА КАРТИНКИ

/**
 * Проверяет id эффекта. Если эффект «Оригинал», то скрывает слайдер регулирования эффекта.
 *
 * @param {string} id - id применяемого эффекта.
 */
var checkEffect = function (id) {
  if (id === effects.original.effectId) {
    uploadScaleImg.classList.add('hidden');
  } else {
    uploadScaleImg.classList.remove('hidden');
  }
};

/**
 * Меняет эффект на превью картинки, основываясь на id выбранного эффекта. Предыдущий эффект удаляется.
 *
 * @param {string} id - id выбранного эффекта.
 */
var changeEffect = function (id) {
  var newClass = effects.original.imgClass;
  if (id === effects.chrome.effectId) {
    newClass = effects.chrome.imgClass;
  } else if (id === effects.sepia.effectId) {
    newClass = effects.sepia.imgClass;
  } else if (id === effects.marvin.effectId) {
    newClass = effects.marvin.imgClass;
  } else if (id === effects.phobos.effectId) {
    newClass = effects.phobos.imgClass;
  } else if (id === effects.heat.effectId) {
    newClass = effects.heat.imgClass;
  }

  checkEffect(id);

  // ПЕРВЫЙ СПОСОБ - удаление всех возможных классов
  // uploadPreviewImg.classList.remove('effects__preview--none', 'effects__preview--chrome', 'effects__preview--sepia', 'effects__preview--marvin', 'effects__preview--phobos', 'effects__preview--heat');
  // ВТОРОЙ СПОСОБ - вынесение отдельной функции - удалить все классы кроме 'img-upload__preview' (или можно вообще удалять все классы, а этот каждый раз добавлять заново)
  // var clearClassList = function (element) {
    // var elementClassList = element.classList;
    //   for (var i = 0; i < elementClassList.length; i++) {
    //     if (elementClassList[i] !== 'img-upload__preview'){
    //       element.classList.remove(elementClassList[i]);
    //     }
    //   }
    // };
  // clearClassList(uploadPreviewImg);
  // ТРЕТИЙ СПОСОБ
  uploadPreviewImg.classList.remove(uploadPreviewImg.classList[1]);
  uploadPreviewImg.classList.add(newClass);
};

// почему здесь обработчик срабатывает только на элемент, изначально выбранный в разметке?
// var checkedInput = effectsListUl.querySelector('input:checked');
// checkedInput.addEventListener('click', function (evt) {
//   changeEffect(evt.target.id);
// });
effectsListUl.addEventListener('change', function (evt) {
  changeEffect(evt.target.id);
});


// ПЕРЕТАСКИВАНИЕ СЛАЙДЕРА

/**
 * Меняет уровень эффекта пропорционально, в зависимости от id эффекта.
 * Для эффекта «Хром» — filter: grayscale(0..1);
 * Для эффекта «Сепия» — filter: sepia(0..1);
 * Для эффекта «Марвин» — filter: invert(0..100%);
 * Для эффекта «Фобос» — filter: blur(0..3px);
 * Для эффекта «Зной» — filter: brightness(1..3).
 *
 * @param {number} level -  выставленный уровень применяемого эффекта.
 * @param {string} id - id применяемого эффекта.
 */
var changeEffectFilter = function (level, id) {
  scaleValueInput.value = level;
  if (id === effects.chrome.effectId) {
    effectNumber = level / 100;
    uploadPreviewImg.style = effects.chrome.filter;
  } else if (id === effects.sepia.effectId) {
    effectNumber = level / 100;
    uploadPreviewImg.style = effects.sepia.filter;
  } else if (id === effects.marvin.effectId) {
    effectNumber = level;
    uploadPreviewImg.style = effects.marvin.filter;
  } else if (id === effects.phobos.effectId) {
    effectNumber = level * 3 / 100;
    uploadPreviewImg.style = effects.phobos.filter;
  } else if (id === effects.heat.effectId) {
    effectNumber = (level * 2/ 100) + 1;
    uploadPreviewImg.style = effects.heat.filter;
  }
};

/**
 * Вычисляет уровень эффекта, основываясь на изменении координаты по оси Х у слайдера.
 *
 * @param {number} coordinateX - актуальная координата пина слайдера.
 * @param {string} id - id применяемого эффекта.
 */
var moveScalePin = function (coordinateX, id) {
  var level = Math.round(coordinateX) * 100 / MAX_COORDINATE_X;
  changeEffectFilter(level, id);
};

scalePin.addEventListener('mouseup', function (evt) {
  moveScalePin(evt.clientX, evt.target.id);
});


