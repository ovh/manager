import template from './terminate.html';

const component = {
  bindings: {
    serviceName: '<',
    goBack: '<',
    goToPublicCloud: '<',
    projectId: '<',
  },
  template,
};

export default component;
