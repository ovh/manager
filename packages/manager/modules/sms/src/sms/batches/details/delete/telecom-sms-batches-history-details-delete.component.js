import controller from './telecom-sms-batches-history-details-delete.controller';
import template from './telecom-sms-batches-history-details-delete.html';

export default {
  bindings: {
    outgoing: '<',
    deleteOutgoing: '<',
    goBackToDetails: '<',
  },
  controller,
  name: 'ovhManagerSmsBatchesHistoryDetailsDeleteComponent',
  template,
};
