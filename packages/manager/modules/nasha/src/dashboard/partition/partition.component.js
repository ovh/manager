import controller from './partition.controller';
import template from './partition.template.html';

export default {
  bindings: {
    alertError: '<',
    currentHref: '<',
    editDescriptionHref: '<',
    editNameHref: '<',
    editSizeHref: '<',
    goToEditDescription: '<',
    goToEditName: '<',
    goToEditSize: '<',
    hasOperation: '<',
    nasha: '<',
    nashaApiUrl: '<',
    partition: '<',
    partitions: '<',
    partitionApiUrl: '<',
    partitionHref: '<',
    reload: '<',
    serviceName: '<',
    tasks: '<',
  },
  controller,
  template,
};
