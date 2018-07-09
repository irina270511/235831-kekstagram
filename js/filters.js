'use strict';
(function () {
  var NEW_PICTURES_QUATITY = 10;
  var filterForm = document.querySelector('.img-filters__form');

  var Filter = {
    filterSelector: {
      'filter-popular': document.querySelector('#filter-popular'),
      'filter-new': document.querySelector('#filter-new'),
      'filter-discussed': document.querySelector('#filter-discussed')
    },

    filterFn: {
      /**
       * Вызывает отрисовку элементов в прямом порядке, перед этим вызвав функцию удаления аналогичных элементов страницы.
       * Вызывается через функцию "устранения дребезга".
       */
      'filter-popular': function () {
        window.kekstagram.util.debounce(function () {
          removePictureLinks();
          var popularPictures = window.kekstagram.pictures.slice();
          window.kekstagram.fn.renderElements(popularPictures, window.kekstagram.el.picturesSection, window.kekstagram.fn.renderPreviewPicture);
        })
      },

      /**
       * Вызывает отрисовку элементов в случайном порядке, перед этим вызвав функцию удаления аналогичных элементов страницы.
       * Количество элементов - NEW_PICTURES_QUATITY.
       * Вызывается через функцию "устранения дребезга".
       */
      'filter-new': function () {
        window.kekstagram.util.debounce(function () {
          removePictureLinks();
          var copyPictures = window.kekstagram.pictures.slice();
          var newPictures = window.kekstagram.util.randomizeArray(copyPictures);
          newPictures.length = NEW_PICTURES_QUATITY;
          window.kekstagram.fn.renderElements(newPictures, window.kekstagram.el.picturesSection, window.kekstagram.fn.renderPreviewPicture);
        })
      },

      /**
       * Вызывает отрисовку элементов в порядке убывания количества комментариев к элементам, перед этим вызвав функцию удаления аналогичных элементов страницы.
       * Вызывается через функцию "устранения дребезга".
       */
      'filter-discussed': function () {
        window.kekstagram.util.debounce(function () {
          removePictureLinks();
          var disscussedPictures = window.kekstagram.pictures.slice();
          disscussedPictures.sort(function (a, b) {
            return b.comments.length - a.comments.length;
          });
          window.kekstagram.fn.renderElements(disscussedPictures, window.kekstagram.el.picturesSection, window.kekstagram.fn.renderPreviewPicture);
        })
      }
    }
  };

  /**
   * Определяет и удаляет все элементы, ранее отрисованные на странице.
   */
  var removePictureLinks = function () {
    var picturesLinks = document.querySelectorAll('.picture__link');
    picturesLinks.forEach(function (item) {
      window.kekstagram.el.picturesSection.removeChild(item);
    });
  };

  /**
   * Обработчик клика на кнопке фильтра. Удаляет класс active у всех кнопок, затем добавляет его только выбранной.
   * Вызывает функцию отрисовки элементов в в заданнном порядке.
   *
   * @param {string} id - id выбранного фильтра.
   */
  var buttonClickHandler = function (id) {
    for (var key in Filter.filterSelector) {
      if (Filter.filterSelector.hasOwnProperty(key)) {
        Filter.filterSelector[key].classList.remove('img-filters__button--active');
      }
    }
    Filter.filterSelector[id].classList.add('img-filters__button--active');
    Filter.filterFn[id]();
  };

  filterForm.addEventListener('click', function (evt) {
    buttonClickHandler(evt.target.id);
  });

})();
