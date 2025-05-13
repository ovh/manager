import controller from './sms-configuration.controller';
import template from './sms-configuration.html';

export default {
  bindings: {
    goToPhonebooksContacts: '<',
    goToReceiversChoice: '<',
    groupSenders: '<',
    isBatch: '<',
    model: '=',
    phonebooks: '<',
    receivers: '<',
    senders: '<',
    sendersHref: '<',
  },
  controller,
  name: 'ovhManagerSmsSmsConfiguration',
  template,
};
