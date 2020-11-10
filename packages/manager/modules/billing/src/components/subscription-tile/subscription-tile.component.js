import controller from './subscription-tile.controller';
import template from './subscription-tile.html';

export default {
  bindings: {
    onError: '&?',
    withEngagement: '<?',
    servicePath: '@',
    serviceInfos: '<?',
  },
  controller,
  template,
  transclude: {
    contactActions: '?billingContactActions',
    extraInformation: '?billingExtraInformation',
  },
};
