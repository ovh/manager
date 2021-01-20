import controller from './netapp.controller';
import template from './netapp.template.html';

export default {
  bindings: {
    netappId: '<',
    serviceLink: '<',
    shareLink: '<',
    currentActiveLink: '<',
    service: '<',
    storages: '<',

    guideUrl: '<',
  },
  controller,
  template,
};
