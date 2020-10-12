import controller from './shares.controller';
import template from './shares.template.html';

export default {
  controller,
  template,
  bindings: {
    netappId: '<',

    serviceLink: '<',
    shareLink: '<',
    currentActiveLink: '<',
    shares: '<',

    guideUrl: '<',

    shareStateEnum: '<',
    stateEnumFilter: '<',
  },
};
