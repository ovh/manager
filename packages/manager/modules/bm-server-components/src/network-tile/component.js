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
    trafficInformations: '<?',
    dedicatedServerFeatureAvailability: '<?',
    ola: '<?',
  },
  controller,
  template,
  transclude: true,
};
