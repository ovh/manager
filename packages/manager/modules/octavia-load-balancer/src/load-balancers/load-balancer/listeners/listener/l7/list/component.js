import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    policies: '<',
    provisioningStatusBadges: '<',
    operatingStatusBadges: '<',
    goToL7PolicyCreation: '<',
    getL7PolicyEditionLink: '<',
    getPoolDetailLinkFromPolicy: '<',
    trackL7Base: '<',
  },
  controller,
  template,
};
