import controller from './hosting-cdn-shared-settings.controller';
import template from './hosting-cdn-shared-settings.html';

export default {
  controller,
  template,
  bindings: {
    domainOptions: '<',
    cdnDetails: '<',
    availableOptions: '<',
    serviceName: '<',
    domainName: '<',
    domain: '<',
    goBack: '<',
    displayCreateCacheRuleModal: '<',
    displayUpdateCacheRuleModal: '<',
    displayConfirmSettingsModal: '<',
    displayLeaveSettingsModal: '<',
    trackClick: '<',
  },
};
