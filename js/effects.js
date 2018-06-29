'use strict';
(function () {
  var uploadScaleImg = document.querySelector('.img-upload__scale');
  var scaleValueInput = document.querySelector('.scale__value');
  var scaleLevel = document.querySelector('.scale__level');
  var scalePin = document.querySelector('.scale__pin');
  var scaleLine = document.querySelector('.scale__line');
  var effectsListUl = document.querySelector('.effects__list');
  var DEFAULT_SIZE = '100%';

  /**
   * Находит координаты линии слайдера.
   *
   * @return {object} coords - координаты линии слайдера.
   */
  var findScaleCoords = function () {
    var scaleCoords = scaleLine.getBoundingClientRect();
    var coords = {
      start: scaleCoords.x + scaleCoords.width,
      width: scaleCoords.width,
      fin: scaleCoords.x
    };
    return coords;
  };

  /**
   * Проверяет id эффекта. Если эффект не «Оригинал», то показывает слайдер регулирования эффекта.
   *
   * @param {string} id - id применяемого эффекта.
   */
  var checkEffect = function (id) {
    if (!(id === 'effect-none')) {
      uploadScaleImg.classList.remove('hidden');
    } else {
      uploadScaleImg.classList.add('hidden');
    }
  };

  /**
   * Возвращает по id эффекта соответстующий класс, который нужно добавить картинке. При передаче неизвестного аргумента вернет undefined.
   *
   * @param {string} id - id применяемого эффекта.
   * @return {string} classes[id] - класс изображения с применяемым эффектом.
   */
  var returnClassEffect = function (id) {
    var classes = {
      'effect-none': 'effects__preview--none',
      'effect-chrome': 'effects__preview--chrome',
      'effect-sepia': 'effects__preview--sepia',
      'effect-marvin': 'effects__preview--marvin',
      'effect-phobos': 'effects__preview--phobos',
      'effect-heat': 'effects__preview--heat'
    };
    return classes[id];
  };

  /**
   * Удаляет все классы у переданного элемента, кроме класса 'img-upload__preview'.
   *
   * @param {object} element - DOM-элемент у которого необходимо удалить все классы.
   */
  var clearClassList = function (element) {
    var elementClassList = element.classList;
    for (var i = 0; i < elementClassList.length; i++) {
      if (elementClassList[i] !== 'img-upload__preview') {
        element.classList.remove(elementClassList[i]);
      }
    }
  };

  /**
   * Меняет эффект на превью картинки, добавляя ей необходимый класс. Основывается на id выбранного эффекта.
   * Перед сменой эффекта меняет положение слайдера и размер картинки на значения по умолчанию.
   *
   * @param {string} id - id выбранного эффекта.
   */
  var changeEffect = function (id) {
    scalePin.style.left = '';
    scaleLevel.style.width = '';
    window.domElements.uploadPreviewImg.style = '';
    window.domElements.sizeValueInput.value = DEFAULT_SIZE;

    var newClass = returnClassEffect(id);
    checkEffect(id);
    clearClassList(window.domElements.uploadPreviewImg);
    window.domElements.uploadPreviewImg.classList.add(newClass);
  };


  /**
   * Меняет уровень эффекта пропорционально, в зависимости от id выбранного эффекта.
   * Для эффекта «Хром» — filter: grayscale(0..1);
   * Для эффекта «Сепия» — filter: sepia(0..1);
   * Для эффекта «Марвин» — filter: invert(0..100%);
   * Для эффекта «Фобос» — filter: blur(0..3px);
   * Для эффекта «Зной» — filter: brightness(1..3).
   *
   * @param {number} level -  выставленный уровень применяемого эффекта.
   */

  var changeEffectLevel = function (level) {
    var effectId = document.querySelector('input[name=effect]:checked').id;
    scaleValueInput.value = level;
    var filterValue = {
      'effect-chrome': 'grayscale(' + level / 100 + ')',
      'effect-sepia': 'sepia(' + level / 100 + ')',
      'effect-marvin': 'invert(' + level + '%)',
      'effect-phobos': 'blur(' + level * 3 / 100 + 'px)',
      'effect-heat': 'brightness(' + (level * 2 / 100 + 1) + ')'
    };
    window.domElements.uploadPreviewImg.style.filter = filterValue[effectId];
  };

  /**
   * Отображает перемещение пина и уровня слайдера. Вызывает функцию смены глубины эффекта.
   *
   * @param {number} coordinateX - текущая координата пина слайдера.
   * @param {object} scaleCoords - координаты линии (возможных положений) слайдера.
   * @param {number} scaleCoords.start - начальная координата линии слайдера.
   * @param {number} scaleCoords.fin - конечная координата линии слайдера.
   * @param {number} scaleCoords.width - длина линии слайдера.
   */
  var moveScalePin = function (coordinateX, scaleCoords) {
    if (coordinateX <= scaleCoords.start && coordinateX >= scaleCoords.fin) {
      var shift = coordinateX - scaleCoords.fin;
      var level = shift / scaleCoords.width * 100;

      scalePin.style.left = shift + 'px';
      scaleLevel.style.width = level + '%';
      changeEffectLevel(level);
    }
  };

  effectsListUl.addEventListener('change', function (evt) {
    changeEffect(evt.target.id);
  });

  scalePin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var coords = findScaleCoords();

    var mouseMoveScaleHandler = function (moveEvt) {
      moveEvt.preventDefault();
      moveScalePin(moveEvt.clientX, coords);
    };

    var mouseUpScaleHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveScaleHandler);
      document.removeEventListener('mouseup', mouseUpScaleHandler);
    };

    document.addEventListener('mousemove', mouseMoveScaleHandler);
    document.addEventListener('mouseup', mouseUpScaleHandler);

  });

})();
