import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    projectId: '<',
    users: '<',
    userModel: '<',
    fieldSecretKeyLabel: '<',
    trackingPrefix: '<',
    onLinkedUserClick: '&',
    onCreateUserClick: '&',
    onUserSelected: '&',
    onUserCreated: '&',
  },
  controller,
  template,
};

export default component;
