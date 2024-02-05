import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    listeners: '<',
    goToListenerCreation: '<',
    getListenerEditionLink: '<',
    goToListenerEdition: '<',
    goToListenerDeletion: '<',
    getPoolDetailLink: '<',
    trackRoot: '<',
    trackBase: '<',
    operatingStatusBadges: '<',
    provisioningStatusBadges: '<',
  },
  controller,
  template,
};
