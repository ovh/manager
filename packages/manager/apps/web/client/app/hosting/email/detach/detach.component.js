import template from './detach.html';

export default {
  bindings: {
    emailOptionName: '<',
    goBack: '<',
    pricingType: '<',
    serviceName: '<',
    workflow: '<',

    onError: '<',
    onSuccess: '<',
  },
  name: 'webDomainEmailDetach',
  template,
};
