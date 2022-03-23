import controller from './upgrade-plan.controller';
import template from './upgrade-plan.html';

const component = {
  bindings: {
    currentPlan: '<',
    database: '<',
    goBack: '<',
    onPlanUpgrade: '<',
    plans: '<',
    projectId: '<',
    trackDatabases: '<',
    user: '<',
    engine: '<',
  },
  template,
  controller,
};

export default component;
