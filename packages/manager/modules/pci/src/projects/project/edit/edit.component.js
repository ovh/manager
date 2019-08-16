import controller from './edit.controller';
import template from './edit.html';

export default {
  bindings: {
    defaultProject: '<',
    onUpdate: '<',
    project: '<',
    unFavProject: '<',
  },
  controller,
  template,
};
