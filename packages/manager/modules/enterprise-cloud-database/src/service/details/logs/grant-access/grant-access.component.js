import controller from './grant-access.controller';
import template from './grant-access.html';

const component = {
  template,
  controller,
  bindings: {
    clusterId: '<',
    goBackToLogs: '<',
  },
};

export default component;
