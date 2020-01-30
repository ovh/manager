import get from 'lodash/get';
import has from 'lodash/has';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import set from 'lodash/set';

export default class CucServiceHelper {
  /* @ngInject */
  constructor($q, $translate, $window, CucCloudMessage) {
    this.$q = $q;
    this.$translate = $translate;
    this.$window = $window;

    this.CucCloudMessage = CucCloudMessage;
  }

  errorHandler(messageInput, containerName, pathsToGetErrorMessage) {
    return (error) => {
      const errorMessageConfig = {};

      const firstPaths = isArray(pathsToGetErrorMessage)
        ? pathsToGetErrorMessage
        : [pathsToGetErrorMessage];
      const standardPaths = ['data.message', 'message', 'data'];

      const paths = [...firstPaths, ...standardPaths];

      return (isArray(error) ? error : [error]).map((currentError) => {
        const matchingPath = paths.find((path) => has(currentError, path));
        errorMessageConfig.apiMessage = get(currentError, matchingPath);

        if (isString(messageInput)) {
          errorMessageConfig.textToTranslate = messageInput;
        } else if (has(messageInput, 'text')) {
          errorMessageConfig.text = messageInput.text;
        } else if (has(messageInput, 'textHtml')) {
          errorMessageConfig.textHtml = messageInput.textHtml;
        } else if (has(messageInput, 'translateParams')) {
          errorMessageConfig.textToTranslate = messageInput.textToTranslate;
          errorMessageConfig.translateParams = messageInput.translateParams;
        } else {
          errorMessageConfig.textToTranslate = 'cuc_helper_global_error';
        }

        const message = this.buildErrorMessage(errorMessageConfig);

        this.CucCloudMessage.error(message, containerName);

        return this.$q.reject(currentError);
      });
    };
  }

  buildErrorMessage(config) {
    const message = {
      text: null,
      textHtml: null,
    };

    if (config.text) {
      message.text = config.text;
    }
    if (config.textHtml) {
      message.textHtml = config.textHtml;
    }

    if (config.translateParams) {
      message.text = this.$translate.instant(
        config.textToTranslate,
        config.translateParams,
      );
    } else if (config.textToTranslate) {
      message.text = this.$translate.instant(config.textToTranslate);
    }

    if (config.apiMessage) {
      message.text = `${message.text} ${config.apiMessage}`;
    }
    return message;
  }

  successHandler(message, containerName) {
    return (data) =>
      (isArray(data) ? data : [data]).map((datum) => {
        let messageToWrite = this.$translate.instant(
          'cuc_helper_global_success',
        );

        if (message) {
          const jsonData = isFunction(datum, 'toJSON')
            ? datum.toJSON()
            : datum || {};
          messageToWrite = isString(message)
            ? this.$translate.instant(message, jsonData)
            : message;
        }

        this.CucCloudMessage.success(messageToWrite, containerName);

        return datum;
      });
  }

  static findOrderId(data) {
    let orderId = get(data, 'order.orderId');
    if (!orderId) {
      const matches = data.url.match(/orderId=(\d+)/);
      if (matches.length > 0) {
        [, orderId] = matches;
      }
    }

    return orderId;
  }

  static findOrderUrl(data) {
    let url = get(data, 'order.url');
    if (!url) {
      url = get(data, 'url');
    }
    return url;
  }

  orderSuccessHandler(newWindow) {
    return (data) => {
      const orderUrl = this.constructor.findOrderUrl(data);
      let orderId = this.constructor.findOrderId(data);

      if (!orderUrl) {
        return this.$q.reject({
          data: {
            message: 'URL not found',
          },
        });
      }
      if (!orderId) {
        orderId = orderUrl;
      }

      set(newWindow, 'location', orderUrl);

      return this.$q.resolve({
        orderUrl,
        orderId,
      });
    };
  }

  orderSuccessMessage(
    { orderUrl, orderId },
    message = 'cuc_helper_order_success',
  ) {
    this.CucCloudMessage.success({
      textHtml: this.$translate.instant(message, {
        orderUrl,
        orderId,
      }),
    });
  }

  orderErrorHandler(newWindow) {
    return (err) => {
      newWindow.close();
      this.errorHandler('cuc_helper_order_error')(err);
    };
  }

  loadOnNewPage(orderPromise, config = {}) {
    const newWindow = this.$window.open('', '_blank');
    newWindow.document.write(this.$translate.instant('cuc_helper_order_doing'));
    return orderPromise
      .then(this.orderSuccessHandler(newWindow))
      .then((data) => {
        if (isFunction(config.successMessage)) {
          return config.successMessage(data);
        }
        if (isString(config.successMessage)) {
          return this.orderSuccessMessage(data, config.successMessage);
        }
        return this.orderSuccessMessage(data);
      })
      .catch(this.orderErrorHandler(newWindow));
  }

  static getTaskProgressType(taskType) {
    switch (taskType) {
      case 'done':
        return 'success';
      case 'error':
        return 'error';
      case 'doing':
      case 'todo':
      case 'paused':
        return 'info';
      default:
        return 'warning';
    }
  }
}
