import template from './detach.html';

export default {
  bindings: {
    emailOptionName: '<',
    goBack: '<',
    pricingType: '<',
    serviceName: '<',
    user: '<',
    workflow: '<',

    onError: '<',
    onSuccess: '<',
  },
  name: 'webDomainEmailDetach',
  template,
};
