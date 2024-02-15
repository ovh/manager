import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    goBack: '<',
    goToPrivateNetworkCreation: '<',
  },
  controller,
  template,
};
