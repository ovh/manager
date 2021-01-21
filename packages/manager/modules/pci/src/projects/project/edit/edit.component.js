import controller from './edit.controller';
import template from './edit.html';

export default {
  bindings: {
    cart: '<',
    checkout: '<',
    defaultProject: '<',
    hds: '<',
    onUpdate: '<',
    project: '<',
    setDefault: '<',
    summary: '<',
    unFavProject: '<',
    checkCartId: '<',
  },
  controller,
  template,
};
