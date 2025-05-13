import controller from './edit.controller';
import template from './edit.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    cart: '<',
    checkout: '<',
    defaultProject: '<',
    hds: '<',
    onUpdate: '<',
    project: '<',
    setDefault: '<',
    summary: '<',
    unFavProject: '<',
    checkCartId: '<',
    hdsProjectOption: '<',
    service: '<',
    iamLink: '<',
    isDiscoveryProject: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};
