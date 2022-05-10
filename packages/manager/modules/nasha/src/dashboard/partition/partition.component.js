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
    partition: '<',
    partitions: '<',
    partitionHref: '<',
    reload: '<',
    serviceName: '<',
    tasks: '<',
  },
  controller,
  template,
};
