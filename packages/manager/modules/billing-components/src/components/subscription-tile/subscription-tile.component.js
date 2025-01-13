import controller from './subscription-tile.controller';
import template from './subscription-tile.html';

export default {
  bindings: {
    onError: '&?',
    withEngagement: '<?',
    servicePath: '@',
    serviceInfos: '<?',
    goToCommit: '&',
    highlightEngagement: '<?',
    goToCancelCommit: '&',
    goToCancelResiliation: '&',
    goToResiliation: '&',
    trackingPrefix: '@',
    trackingPage: '@',
    trackingNameSuffix: '@',
    commitImpressionData: '<?',
    withContactManagement: '<?',
    disableServiceActions: '<?',
    isCustomResiliationHandled: '<?',
    handleGoToResiliation: '&?',
  },
  controller,
  template,
  transclude: {
    contactActions: '?billingContactActions',
    extraInformation: '?billingExtraInformation',
  },
};
