'use strict';
(function () {
  var scaleValueInput = document.querySelector('.scale__value');
  var scaleLine = document.querySelector('.scale__line');
  var effectsListUl = document.querySelector('.effects__list');

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
    if (id !== 'effect-none') {
      window.kekstagram.el.uploadScaleImg.classList.remove('hidden');
    } else {
      window.kekstagram.el.uploadScaleImg.classList.add('hidden');
    }
  };

  /**
   * Возвращает по названию эффекта соответстующий класс, который нужно добавить картинке.
   * Название класса формируется из постоянной составляющей 'effects__preview--' и части названия эффекта (его id).
   *
   * @param {string} name - название применяемого эффекта.
   * @return {string} - сформированный класс изображения с применяемым эффектом.
   */
  var returnClassEffect = function (name) {
    return 'effects__preview--' + name.split('-')[1];
  };

  /**
   * Меняет эффект на превью картинки, добавляя ей необходимый класс. Основывается на id выбранного эффекта.
   * Перед сменой эффекта вызывает функцию очищения предыдущих параметров картинки.
   *
   * @param {string} id - id выбранного эффекта.
   */
  var changeEffect = function (id) {
    window.kekstagram.fn.clearStyle();
    var newClass = returnClassEffect(id);
    checkEffect(id);
    window.kekstagram.el.uploadPreviewImg.classList.add(newClass);
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
    scaleValueInput.value = level.toFixed();
    var filterValue = {
      'effect-chrome': 'grayscale(' + level / 100 + ')',
      'effect-sepia': 'sepia(' + level / 100 + ')',
      'effect-marvin': 'invert(' + level + '%)',
      'effect-phobos': 'blur(' + level * 3 / 100 + 'px)',
      'effect-heat': 'brightness(' + (level * 2 / 100 + 1) + ')'
    };
    window.kekstagram.el.uploadPreviewImg.style.filter = filterValue[effectId];
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

      window.kekstagram.el.scalePin.style.left = shift + 'px';
      window.kekstagram.el.scaleLevel.style.width = level + '%';
      changeEffectLevel(level);
    }
  };

  effectsListUl.addEventListener('change', function (evt) {
    changeEffect(evt.target.id);
  });

  window.kekstagram.el.scalePin.addEventListener('mousedown', function (evt) {
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
