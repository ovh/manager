import controller from './flavors-list.controller';
import template from './flavors-list.html';

export default {
  bindings: {
    flavors: '<',
    selectedFlavor: '=',
    user: '<',
  },
  controller,
  template,
};
