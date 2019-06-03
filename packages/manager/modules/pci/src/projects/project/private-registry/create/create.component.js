import controller from './create.controller';
import template from './create.html';

const component = {
  template,
  controller,
  bindings: {
    goBack: '<',
    projectId: '<',
    contractInfo: '<',
  },
};

export default component;
