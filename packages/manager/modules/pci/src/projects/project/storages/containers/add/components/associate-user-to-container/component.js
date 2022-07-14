import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    projectId: '<',
    users: '<',
    userModel: '<',
    onLinkedUserClick: '&',
    onCreateUserClick: '&',
    onUserSelected: '&',
    onUserCreated: '&',
    trackingPrefix: '<',
  },
  controller,
  template,
};

export default component;
