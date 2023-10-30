import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    listenerId: '<',
    listenerName: '<',
    goBack: '<',
    trackAction: '<',
    trackPage: '<',
  },
  controller,
  template,
};
