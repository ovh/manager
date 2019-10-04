import controller from './update-name.controller';
import template from './update-name.html';

const component = {
  bindings: {
    clusterId: '<',
    clusterDetails: '<',
    goBack: '<',
    goToOverview: '<',
  },
  controller,
  template,
};

export default component;
