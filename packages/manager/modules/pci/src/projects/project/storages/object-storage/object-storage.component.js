import controller from './object-storage.controller';
import template from './object-storage.html';

export default {
  controller,
  bindings: {
    guideUrl: '<',
    currentActiveLink: '<',
    containersLink: '<',
    userListLink: '<',
  },
  template,
};
