import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    projectId: '<',
    region: '<',
    poolId: '<',
    pool: '<',
    goBack: '<',
  },
  controller,
  template,
};
