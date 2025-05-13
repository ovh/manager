import template from './template.html';

export default {
  bindings: {
    goBack: '<',
    pricingType: '<',
    serviceName: '<',
    workflow: '<',

    onError: '<',
    onSuccess: '<',
  },
  name: 'webHostingDatabaseDetachPrivate',
  template,
};
