'use strict';
(function () {
  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';
  var DOWNLOAD_URL = 'https://js.dump.academy/kekstagram/data';
  var DEFAULT_TIMEOUT = 30000;

  /**
   * Отправляет данные на сервер.
   * Адрес сервера - UPLOAD_URL.
   *
   * @param {object} data - данные, которые отправляются на сервер (загружаемая картинка и ее параметры).
   * @param {function} onLoad - обработчик успешной отправки.
   * @param {function} onError - обработчик неуспешной отправки. Принимает в качестве параметра string - сообщение об ошибке.
   */
  window.kekstagram.fn.upload = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    requestHandler(xhr, onLoad, onError);

    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  /**
   * Запрашивает и принимает данные с сервера.
   * Адрес сервера - DOWNLOAD_URL.
   *
   * @param {function} onLoad - обработчик успешной загрузки. Принимает в качестве параметра данные - массив объектов.
   * @param {function} onError - обработчик неуспешной загрузки. Принимает в качестве параметра string - сообщение об ошибке.
   */
  window.kekstagram.fn.download = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    requestHandler(xhr, onLoad, onError);

    xhr.open('GET', DOWNLOAD_URL);
    xhr.send();
  };

  /**
   * Вызывает функции-обработчики для успешной и неуспешной отправки.
   *
   * @param {object} xhr - объект XMLHttpRequest.
   * @param {function} onLoad - обработчик успешной отправки.
   * @param {function} onError - обработчик неуспешной отправки.
   */
  var requestHandler = function (xhr, onLoad, onError) {
    xhr.responseType = 'json';
    xhr.timeout = DEFAULT_TIMEOUT;

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;

        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Ничего не найдено';
          break;

        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения. Попробуйте перегрузить страницу');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс. Попробуйте перегрузить страницу');
    });
  }

})();

