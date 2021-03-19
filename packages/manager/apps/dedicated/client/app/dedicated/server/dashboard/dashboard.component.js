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
    trafficInformations: '<',
    user: '<',
    vrackInfos: '<',
    worldPart: '<',
    incidentStatus: '<',
  },
  controller,
  template,
  require: {
    dedicatedServer: '^dedicatedServer',
  },
};
