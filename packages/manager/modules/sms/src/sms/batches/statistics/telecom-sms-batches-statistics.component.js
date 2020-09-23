import controller from './telecom-sms-batches-statistics.controller';
import template from './telecom-sms-batches-statistics.html';

export default {
  bindings: {
    batch: '<',
    batches: '<',
    batchStatuses: '<',
    formatStatus: '<',
    getBatchStatistics: '<',
    goBack: '<',
    goToDetails: '<',
  },
  controller,
  name: 'ovhManagerSmsBatchesStatisticsComponent',
  template,
};
