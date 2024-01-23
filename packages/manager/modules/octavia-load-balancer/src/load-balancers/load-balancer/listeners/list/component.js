import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    listeners: '<',
    goToListenerCreation: '<',
    getListenerEditionLink: '<',
    goToListenerEdition: '<',
    goToListenerL7Policies: '<',
    goToListenerDeletion: '<',
    getPoolDetailLinkFromListener: '<',
    trackRoot: '<',
    trackBase: '<',
    operatingStatusBadges: '<',
    provisioningStatusBadges: '<',
  },
  controller,
  template,
};
