import assignIn from 'lodash/assignIn';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import isPlainObject from 'lodash/isPlainObject';
import lastIndexOf from 'lodash/lastIndexOf';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import set from 'lodash/set';
import 'moment';

export default class CucCloudMessage {
  /* @ngInject */
  constructor($transitions, $state, $location) {
    this.$state = $state;
    this.$location = $location;
    this.messages = {};
    this.subscribers = {};

    $transitions.onSuccess({}, () => {
      this.flushChildMessage();
    });
  }

  success(message, containerName) {
    this.logMessage(
      isPlainObject(message) ? message : { text: message },
      'success',
      containerName,
    );
  }

  error(message, containerName) {
    this.logMessage(
      isPlainObject(message) ? message : { text: message },
      'error',
      containerName,
    );
  }

  warning(message, containerName) {
    this.logMessage(
      isPlainObject(message) ? message : { text: message },
      'warning',
      containerName,
    );
  }

  info(message, containerName) {
    this.logMessage(
      isPlainObject(message) ? message : { text: message },
      'info',
      containerName,
    );
  }

  /*
   * Handle the message type (error, warning, ...etc) and push the message to the messageHandler
   */
  logMessage(messageHash, type, containerName) {
    if (!messageHash.text && !messageHash.textHtml) {
      return;
    }

    const messageHandler = this.getMessageHandler(containerName);

    if (messageHandler) {
      // Message age defines how many flush the message went through.
      const message = assignIn(
        {
          type,
          origin: containerName || this.$state.current.name,
          timestamp: moment().valueOf(),
        },
        messageHash,
      );
      messageHandler.messages.push(message);
      messageHandler.onMessage();

      this.pushMessageToSearch(message);
    } else {
      // eslint-disable-next-line no-console
      console.log(`Unhandled message ${messageHash.text}`);
    }
  }

  pushMessageToSearch(message) {
    const queryProperty = `${message.type}Messages`;

    const queryMessages = this.$location.search()[queryProperty] || [];

    queryMessages.push(message.text || message.textHtml);

    this.$location.search(queryProperty, queryMessages);
  }

  removeMessageFromSearch(message) {
    const queryProperty = `${message.type}Messages`;

    const queryMessages = this.$location.search()[queryProperty] || [];

    const foundIndex = queryMessages.indexOf(message.text || message.textHtml);
    if (foundIndex !== -1) {
      queryMessages.splice(foundIndex, 1);

      this.$location.search(queryProperty, queryMessages);
    }
  }

  /*
   * Handle message to dispatch.
   * @params containerName : custom name for the container
   * if no params is passed, it will take the current state name as containerName
   */
  /* eslint-disable no-param-reassign */
  getMessageHandler(containerName) {
    containerName = `${containerName || this.$state.current.name}.`;
    let messageHandler = null;
    do {
      containerName = containerName.substring(
        0,
        lastIndexOf(containerName, '.'),
      );
      messageHandler = this.subscribers[containerName];
    } while (!messageHandler && includes(containerName, '.'));
    return messageHandler;
  }
  /* eslint-enable no-param-reassign */

  /*
   * Retrieve messages
   */
  getMessages(containerName) {
    return this.subscribers[containerName].messages;
  }

  /*
   * Flush currents messages
   */
  flushMessages(containerName) {
    const messageHandler = this.getMessageHandler(containerName);

    if (messageHandler) {
      messageHandler.messages = [];
      messageHandler.onMessage();
    }
  }

  flushChildMessage(containerName) {
    const messageHandler = this.getMessageHandler(containerName);

    if (messageHandler) {
      const now = moment().valueOf();
      messageHandler.messages = filter(
        messageHandler.messages,
        (message) =>
          message.origin === messageHandler.containerName ||
          (!message.forceFlush && now - 500 < message.timestamp),
      );

      forEach(messageHandler.messages, (message) => {
        if (message.origin !== messageHandler.containerName) {
          set(message, 'forceFlush', true);
        }
      });

      messageHandler.onMessage();
    }
  }

  /*
   * unsubscribe to the message receiver.
   */
  unSubscribe(containerName) {
    const subscriber = this.subscribers[containerName];
    if (subscriber) {
      this.subscribers[containerName].messages = [];
      this.subscribers[containerName].onMessage();
    }
    this.subscribers = omit(this.subscribers, containerName);
  }

  /*
   * subscibe to the message receiver.
   * @params containerName : container name or the state name to subscribe
   * @params params actions to do
   * ex params : { onMessage: () => this.getMessage() }
   */
  subscribe(containerName, params) {
    this.subscribers[containerName] = assignIn(
      {
        containerName,
        messages: [],
        onMessage: noop(),
      },
      params,
    );
    return {
      getMessages: () => this.getMessages(containerName),
    };
  }
}
