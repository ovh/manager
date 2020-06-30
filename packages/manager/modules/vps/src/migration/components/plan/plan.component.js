import controller from './plan.controller';
import template from './template.html';

export default {
  bindings: {
    goBack: '<',
    servers: '<',
    user: '<',
  },
  controller,
  name: 'vpsMigrationPlan',
  template,
};
