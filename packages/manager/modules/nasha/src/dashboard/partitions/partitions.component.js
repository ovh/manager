import controller from './partitions.controller';
import template from './partitions.template.html';

export default {
  bindings: {
    alertError: '<',
    alertSuccess: '<',
    goToPagePartition: '<',
    goToPagePartitionAccesses: '<',
    goToPagePartitionSnapshots: '<',
    goToTabPartitionsCreate: '<',
    goToTabPartitionsDelete: '<',
    goToTabPartitionsEditSize: '<',
    goToTabPartitionsZfsOptions: '<',
    nasha: '<',
    nashaApiUrl: '<',
    preparePartition: '<',
    reload: '<',
    serviceInfo: '<',
    serviceName: '<',
    urlRenew: '<',
  },
  controller,
  template,
};
