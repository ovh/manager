import controller from './edit.controller';
import template from './edit.html';

export default {
  bindings: {
    billLink: '<',
    changeContact: '<',
    currentUser: '<',
    goBack: '<',
    service: '<',
  },
  controller,
  template,
};
