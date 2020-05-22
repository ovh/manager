import template from './template.html';

export default {
  bindings: {
    detachableStart10m: '<',
    domainName: '<',
    goBack: '<',
    pricingType: '<',
    start10mHosting: '<',
    user: '<',
    workflow: '<',

    onError: '<',
    onSuccess: '<',
  },
  name: 'freeWebhostingDomainDetach',
  template,
};
