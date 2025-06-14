import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  bindings: {
    logSubscriptionApiData: '<',
    goBack: '<',
    description: '@',
    trackingHits: '<',
    trackClick: '<',
    apiVersion: '<?',
    logKindsList: '<?',
  },
};
