import controller from './acl.controller';
import template from './acl.html';

export default {
  bindings: {
    projectId: '<',
    database: '<',
    trackDashboard: '<',
    goToAddAcl: '<',
    deleteAcl: '<',
    refreshAcl: '<',
    aclList: '<',
  },
  controller,
  template,
};
