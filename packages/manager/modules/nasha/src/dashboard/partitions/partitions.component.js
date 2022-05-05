import controller from './partitions.controller';
import template from './partitions.template.html';

export default {
  bindings: {
    alertError: '<',
    alertSuccess: '<',
    goToPagePartitionAccess: '<',
    goToPagePartitionDashboard: '<',
    goToPagePartitionSnapshots: '<',
    goToTabPartitionsCreate: '<',
    goToTabPartitionsDelete: '<',
    goToTabPartitionsEditSize: '<',
    goToTabPartitionsZfsOptions: '<',
    localizeOperation: '<',
    nasha: '<',
    preparePartition: '<',
    reload: '<',
    serviceInfo: '<',
    serviceName: '<',
    urlRenew: '<',
  },
  controller,
  template,
};
