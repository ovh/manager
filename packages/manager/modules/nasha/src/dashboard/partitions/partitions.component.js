import controller from './partitions.controller';
import template from './partitions.template.html';

export default {
  bindings: {
    alertError: '<',
    alertSuccess: '<',
    currentHref: '<',
    goToPagePartition: '<',
    goToPagePartitionAccess: '<',
    goToPagePartitionSnapshots: '<',
    goToTabPartitionsCreate: '<',
    goToTabPartitionsDelete: '<',
    goToTabPartitionsEditSize: '<',
    goToTabPartitionsZfsOptions: '<',
    localizeOperation: '<',
    nasha: '<',
    nashaApiUrl: '<',
    partitionsHref: '<',
    preparePartition: '<',
    reload: '<',
    serviceInfo: '<',
    serviceName: '<',
    task: '<',
    tasks: '<',
    urlRenew: '<',
  },
  controller,
  template,
};
