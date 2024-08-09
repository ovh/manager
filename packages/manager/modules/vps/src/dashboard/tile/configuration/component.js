import controller from './controller';
import template from './index.html';

export default {
  name: 'vpsDashboardTileConfiguration',
  controller,
  template,
  bindings: {
    configurationTile: '<',
    catalog: '<',
    isInRescueMode: '<',
    vps: '<',
    stateVps: '<',
    getUpscaleHref: '<',
    goToUpgrade: '<',
    vpsUpgradeTask: '<',
    isMigrating: '<',
    serviceInfos: '<',
    isResellerResourceProductName: '<',
    tabSummary: '<',
    vpsMigrationTask: '<',
    vpsLinkedDisk: '<',
    serviceName: '<',
    upgradableDisks: '<',
    isVpsNewRange: '<',
    goToUpgradeAdditionalDisk: '<',
    goToTerminateOption: '<',
  },
};
