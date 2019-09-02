import template from './autorenew-invite.component.html';
import controller from './autorenew-invite.controller';

export default {
  template,
  bindings: {
    productType: '@',
    serviceInfos: '<',
    guideUrl: '@',
    autorenewUrl: '@',
  },
  controller,
};
