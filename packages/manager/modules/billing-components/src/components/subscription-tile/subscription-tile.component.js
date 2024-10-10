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
    commitImpressionData: '<?',
    withContactManagement: '<?',
    disableServiceActions: '<?',
    isCustomResiliationHandle: '<?',
    handleGoToResiliation: '&?',
  },
  controller,
  template,
  transclude: {
    contactActions: '?billingContactActions',
    extraInformation: '?billingExtraInformation',
  },
};
