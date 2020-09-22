import template from './telecom-sms-batches-history-details-delete.html';

export default {
  bindings: {
    outgoing: '<',
    deleteOutgoing: '<',
    goBack: '<',
  },
  name: 'ovhManagerSmsBatchesHistoryDetailsDeleteComponent',
  template,
};
