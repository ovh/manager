import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    poolName: '<',
    poolId: '<',
    goBack: '<',
    trackDeleteAction: '<',
    trackDeletePage: '<',
  },
  controller,
  template,
};
