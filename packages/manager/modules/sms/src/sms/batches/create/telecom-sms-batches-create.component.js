import controller from './telecom-sms-batches-create.controller';
import template from './telecom-sms-batches-create.html';

export default {
  bindings: {
    createBatch: '<',
    getOrderHref: '<',
    getSendersHref: '<',
    goBack: '<',
    goToComposeTip: '<',
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
    user: '<',
  },
  controller,
  name: 'ovhManagerSmsBatchesCreateComponent',
  template,
};
