import controller from './object-storage.controller';
import template from './object-storage.html';

export default {
  controller,
  bindings: {
    guideUrl: '<',
    isUserTabActive: '<',
    containersLink: '<',
    userListLink: '<',
  },
  template,
};
