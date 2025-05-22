import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import forEachRight from 'lodash/forEachRight';
import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';
import keys from 'lodash/keys';
import map from 'lodash/map';
import set from 'lodash/set';
import some from 'lodash/some';

import UniqueMessageComposite from './unique-message-composite';

export default class CuiMessageContainerCtrl {
  /* @ngInject */
  constructor($scope, CucCloudMessage) {
    this.$scope = $scope;
    this.CucCloudMessage = CucCloudMessage;
  }

  $onInit() {
    this.messages = this.messages || [];
    this.dismissableTypes = this.dismissableTypes || ['info', 'success'];
    this.groupedTypes = this.groupedTypes || ['error'];

    this.$scope.$watchCollection(
      () => this.messages,
      () => {
        this.refreshValues();
        this.groupedMessages = this.getGroupedMessages();
      },
    );
  }

  static shouldDisplayGroupedMessages(messageCategory) {
    return (
      filter(messageCategory.values, (value) => !value.dismissed).length !==
        1 && messageCategory.isGroupable
    );
  }

  hasMessageToDisplay() {
    return this.messages.length;
  }

  hasGroupMessageToDisplay(type) {
    const messageGroup = find(
      this.groupedMessages,
      (group) => group.key === type,
    );
    return some(messageGroup.values, (value) => !value.dismissed);
  }

  refreshValues() {
    let messageOrder = 0;

    forEachRight(this.messages, (message) => {
      if (!includes([true, false], message.dismissed)) {
        set(message, 'dismissed', false);
      }

      set(message, 'dismissable', this.isDismissable(message.type));
      set(message, 'messageOrder', (messageOrder += 1));
    });
  }

  getGroupedMessages() {
    const groupedMessages = groupBy(this.messages, 'type');

    const messagePriorities = {
      error: 1,
      warning: 2,
      info: 3,
      success: 4,
    };

    return map(keys(groupedMessages), (key) => ({
      key,
      values: this.constructor.extractUniqueMessage(
        groupedMessages[key],
        (message) => this.CucCloudMessage.removeMessageFromSearch(message),
      ),
      isGroupable: this.isGroupable(key),
      priority: messagePriorities[key],
      dismissable: this.isDismissable(key),
    }));
  }

  isGroupable(type) {
    return includes(this.groupedTypes, type);
  }

  isDismissable(type) {
    return includes(this.dismissableTypes, type);
  }

  static extractUniqueMessage(messageList, onDismiss) {
    const groupedMessages = groupBy(
      messageList,
      (message) => message.text || message.textHtml,
    );
    const groupedMessagesHash = map(
      keys(groupedMessages),
      (key) => new UniqueMessageComposite(groupedMessages[key], onDismiss),
    );
    return groupedMessagesHash;
  }

  static onDismiss(message) {
    message.dismiss();
  }

  static onGroupDismiss(groupedMessages) {
    forEach(groupedMessages.values, (message) => message.dismiss());
  }
}
