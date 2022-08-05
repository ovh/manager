import controller from './partitions.controller';
import template from './partitions.template.html';

export default {
  bindings: {
    alertError: '<',
    alertSuccess: '<',
    canCreatePartitions: '<',
    goToPagePartition: '<',
    goToPagePartitionAccesses: '<',
    goToPagePartitionSnapshots: '<',
    goToTabPartitionsCreate: '<',
    goToTabPartitionsDelete: '<',
    goToTabPartitionsEditSize: '<',
    goToTabPartitionsZfsOptions: '<',
    nasha: '<',
    nashaApiUrl: '<',
    numberOfPartitions: '<',
    preparePartition: '<',
    reload: '<',
    serviceInfo: '<',
    serviceName: '<',
    urlRenew: '<',
    trackClick: '<',
  },
  controller,
  template,
};
