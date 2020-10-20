import controller from './telecom-sms-batches-create.controller';
import template from './telecom-sms-batches-create.html';

export default {
  bindings: {
    createBatch: '<',
    getSendersHref: '<',
    goBack: '<',
    goToComposeTip: '<',
    goToOrder: '<',
    goToPhonebooksContacts: '<',
    goToReceiversChoice: '<',
    goToSizeTip: '<',
    groupBySenderType: '<',
    onSuccess: '&',
    phonebooks: '<',
    receivers: '<',
    receiversUrl: '<',
    selectedReceivers: '<',
    senders: '<',
    service: '<',
    smsClasses: '<',
    trackClick: '<',
    user: '<',
  },
  controller,
  name: 'ovhManagerSmsBatchesCreateComponent',
  template,
};
