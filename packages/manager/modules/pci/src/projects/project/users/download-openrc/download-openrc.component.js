import controller from './download-openrc.controller';
import template from './download-openrc.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    userId: '<',
    user: '<',
    regions: '<',
    openstackGuide: '<',
    goBack: '<',
  },
};
