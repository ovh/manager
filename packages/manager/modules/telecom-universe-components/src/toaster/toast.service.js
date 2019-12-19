import angular from 'angular';
import defaults from 'lodash/defaults';
import filter from 'lodash/filter';
import get from 'lodash/get';
import remove from 'lodash/remove';

/**
 * ovh-angular-toaster replacement.
 */
export default /* @ngInject */ function ($timeout) {
  const self = this;

  const defaultOptions = {
    hideAfter: 42000, // default time in milliseconds for message to be displayed
  };

  let messages = []; // list of message

  function pushMessage(message, type, opts) {
    const options = defaults(opts || {}, defaultOptions);

    const timeout = get(options, 'hideAfter');
    const msg = {
      content: message,
      type,
    };

    messages.push(msg);

    if (angular.isNumber(timeout)) {
      $timeout(() => {
        remove(messages, msg);
      }, timeout);
    }
  }

  self.success = function success(message, opts) {
    pushMessage(message, 'success', opts);
  };

  self.info = function info(message, opts) {
    pushMessage(message, 'info', opts);
  };

  self.warn = function warn(message, opts) {
    pushMessage(message, 'warning', opts);
  };

  self.error = function error(message, opts) {
    pushMessage(message, 'error', opts);
  };

  self.clearMessages = function clearMessages() {
    messages = [];
  };

  self.clearMessage = function clearMessage(message) {
    messages = filter(messages, (msg) => msg !== message);
  };

  self.clearMessagesByType = function clearMessagesByType(type) {
    messages = filter(messages, (msg) => msg.type !== type);
  };

  self.getMessages = function getMessages() {
    return messages;
  };

  self.getMessagesByType = function getMessagesByType(type) {
    return filter(messages, { type });
  };
}
