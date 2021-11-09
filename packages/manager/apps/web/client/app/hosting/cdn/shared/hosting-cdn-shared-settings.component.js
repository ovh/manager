import controller from './hosting-cdn-shared-settings.controller';
import template from './hosting-cdn-shared-settings.html';

export default {
  controller,
  template,
  bindings: {
    user: '<',
    domainOptions: '<',
    cdnRange: '<',
    cdnDetails: '<',
    cdnOptionTypeEnum: '<',
    availableOptions: '<',
    serviceName: '<',
    domainName: '<',
    domain: '<',
    goBack: '<',
    displayCreateCacheRuleModal: '<',
    displayUpdateCacheRuleModal: '<',
    displayConfirmSettingsModal: '<',
    displayLeaveSettingsModal: '<',
    displayChangeCdnOfferModal: '<',
    displayPrewarmEditUrlsModal: '<',
    guideLinkHref: '<',
    hasSslForDomain: '<',
    openCorsList: '<',
    trackClick: '<',
  },
};
