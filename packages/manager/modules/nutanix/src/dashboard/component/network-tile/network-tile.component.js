import controller from './network-tile.controller';
import template from './template.html';

export default {
  bindings: {
    cluster: '<',
    goToUpgradePrivateBandwidth: '<',
    onError: '&?',
    privateBandwidthServiceId: '<',
    isOldCluster: '<',
  },
  controller,
  template,
};
