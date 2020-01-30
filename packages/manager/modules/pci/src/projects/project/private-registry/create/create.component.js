import controller from './create.controller';
import template from './create.html';

const component = {
  template,
  controller,
  bindings: {
    availableRegions: '<',
    goBack: '<',
    plans: '<',
    projectId: '<',
    registryContracts: '<',
    acceptTermsAndConditions: '<',
    user: '<',
  },
};

export default component;
