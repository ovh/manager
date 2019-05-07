import controller from './openstack-token.controller';
import template from './openstack-token.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    userId: '<',
    user: '<',
    goBack: '<',
  },
};
