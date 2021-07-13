import controller from './dashboard.controller';
import template from './dashboard.html';

export default {
  bindings: {
    bandwidthInformations: '<',
    biosSettings: '<',
    bringYourOwnImage: '<',
    changeOwnerUrl: '<',
    eligibleData: '<',
    goToCommit: '<',
    goToCancelCommit: '<',
    goToCancelResiliation: '<',
    goToResiliation: '<',
    goToSgxIntroduction: '<',
    goToSgxManage: '<',
    isCommitmentAvailable: '<',
    monitoringProtocolEnum: '<',
    ola: '<',
    orderPrivateBandwidthLink: '<',
    orderPublicBandwidthLink: '<',
    resiliatePrivateBandwidthLink: '<',
    resiliatePublicBandwidthLink: '<',
    server: '<',
    serviceInfos: '<',
    serviceMonitoring: '<',
    specifications: '<',
    technicalDetails: '<',
    trackingPrefix: '<',
    trafficInformations: '<',
    user: '<',
    vrackInfos: '<',
    worldPart: '<',
    goToManualUpgrade: '<',
    isRamUpgradable: '<',
    isDataDiskUpgradable: '<',
    upgradeWithTicketAvailable: '<',
    resiliationCapability: '<',
    terminateLink: '<',
    serverName: '<',
    goToOsInstallChooseSource: '<',
    goToOsInstallProgress: '<',
    goToNetboot: '<',
  },
  controller,
  template,
  require: {
    dedicatedServer: '^dedicatedServer',
  },
};
