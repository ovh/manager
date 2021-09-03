import controller from './create-topic.controller';
import template from './create-topic.html';

const component = {
  bindings: {
    database: '<',
    goBack: '<',
    projectId: '<',
    trackDashboard: '<',
  },
  template,
  controller,
};

export default component;
