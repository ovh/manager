import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import set from 'lodash/set';

import template from './toast-message.html';

export default {
  template,
  controller(TucToast, $timeout) {
    'ngInject';

    const timestamp = (new Date()).getTime();

    this.hasNewMessages = false;

    this.messageTypes = [
      'error',
      'warning',
      'info',
      'success',
    ];

    this.updateMessages = (messages) => {
      // update messages timestamp
      const pendingMessages = filter(messages, (m) => !m.timestamp);

      if (pendingMessages.length) {
        this.hasNewMessages = true;
        $timeout(() => {
          this.hasNewMessages = false;
        }, 1000);
      }

      forEach(pendingMessages, (m) => {
        set(m, 'timestamp', timestamp);
      });
    };

    this.getMessagesByType = (type) => {
      const messages = TucToast.getMessagesByType(type);

      this.updateMessages(messages);

      // do not display old messages
      return filter(messages, (m) => m.timestamp >= timestamp);
    };

    this.getAllMessages = () => {
      const messages = TucToast.getMessages();

      this.updateMessages(messages);

      // do not display old messages
      return filter(messages, (m) => m.timestamp >= timestamp);
    };

    this.hasMessagesOfType = (type) => this.getMessagesByType(type).length > 0;

    this.clearMessage = (message) => TucToast.clearMessage(message);

    this.clearMessagesByType = (type) => TucToast.clearMessagesByType(type);
  },
};
