import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    loadbalancer: '<',
    region: '<',
    pool: '<',
    goBack: '<',
    trackNameEditionAction: '<',
  },
  controller,
  template,
};
