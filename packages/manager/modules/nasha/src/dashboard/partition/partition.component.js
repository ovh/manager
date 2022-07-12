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
    nasha: '<',
    partition: '<',
    partitions: '<',
    partitionApiUrl: '<',
    partitionHref: '<',
    reload: '<',
    serviceName: '<',
  },
  controller,
  template,
};
