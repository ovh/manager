import controller from './terminate.controller';
import template from './terminate.html';

const component = {
  bindings: {
    ProjectName: '<',
    projectId: '<',
    goBack: '<',
  },
  template,
  controller,
};

export default component;
