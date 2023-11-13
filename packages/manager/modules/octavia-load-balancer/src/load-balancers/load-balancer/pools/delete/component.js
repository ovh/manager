import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    poolId: '<',
    poolName: '<',
    goBack: '<',
    trackDeleteAction: '<',
    trackDeletePage: '<',
  },
  controller,
  template,
};
