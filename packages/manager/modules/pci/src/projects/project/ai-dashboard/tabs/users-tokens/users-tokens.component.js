import controller from './users-tokens.controller';
import template from './users-tokens.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    trackingPrefix: '<',
    aiTokens: '<',
    aiUsers: '<',
    aiRoles: '<',
    goToCreateUser: '<',
    goToCreateToken: '<',
    goToManageUser: '<',
    goToDeleteToken: '<',
  },
};
