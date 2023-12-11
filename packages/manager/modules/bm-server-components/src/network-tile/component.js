import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    server: '<',
    dedicatedServer: '<',
    bandwidthInformations: '<',
    onError: '&?',
    trackingPrefix: '<',
    specifications: '<?',
    isOldCluster: '<?',
    orderPrivateBandwidthLink: '<',
    orderPublicBandwidthLink: '<',
    serviceInfos: '<',
    trafficInformation: '<?',
    dedicatedServerFeatureAvailability: '<?',
    ola: '<?',
    goToUpdateReverseDns: '<?',
    goToDeleteReverseDns: '<?',
  },
  controller,
  template,
  transclude: true,
};
