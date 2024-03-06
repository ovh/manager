import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  transclude: {
    serviceDescription: '?serviceDescription',
  },
  bindings: {
    logApiUrl: '<',
    logKindApiUrl: '<',
    logServiceGuideLink: '<',
    logSubscriptionUrl: '<',
    goToListingPage: '<',
  },
};
