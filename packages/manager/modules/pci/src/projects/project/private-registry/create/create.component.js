import controller from './create.controller';
import template from './create.html';

const component = {
  template,
  controller,
  bindings: {
    availableRegions: '<',
    getCredentialsLink: '<',
    goBack: '<',
    plans: '<',
    projectId: '<',
    registryContracts: '<',
    user: '<',
  },
};

export default component;
