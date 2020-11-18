import controller from './storages.controller';
import template from './storages.template.html';

export default {
  bindings: {
    nasha: '<',
    nas: '<',
    netapp: '<',
    storages: '<',
  },
  controller,
  template,
};
