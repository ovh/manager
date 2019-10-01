import controller from './remove.controller';
import template from './remove.html';

export default {
  bindings: {
    defaultProject: '<',
    delete: '<',
    goBack: '<',
    unFavProject: '<',
  },
  controller,
  template,
};
