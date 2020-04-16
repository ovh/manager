import template from './template.html';

export default {
  bindings: {
    goBack: '<',
    pricingType: '<',
    serviceName: '<',
    user: '<',
    workflow: '<',

    onError: '<',
    onSuccess: '<',
  },
  name: 'webHostingDatabaseDetachPrivate',
  template,
};
