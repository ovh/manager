import controller from './overview.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    datacenters: '<',
    getCancelTerminationUrl: '<',
    goToAssociateVrackPage: '<',
    goToLockPortPage: '<',
    goToAddPopConfigurationPage: '<',
    goToRemovePopConfigurationPage: '<',
    goToDatacenterAddPage: '<',
    goToDatacenterAddExtraPage: '<',
    goToRemoveDatacenterConfigurationPage: '<',
    goToRemoveExtraPage: '<',
    goToRemoveVrackPage: '<',
    goToUnlockPortPage: '<',
    goToUpdateDescriptionPage: '<',
    goToRegenerateServiceKeyPage: '<',
    goToSendServiceKeyPage: '<',
    goToManageServiceKeysPage: '<',
    goToChangeBandwidthPage: '<',
    goToCheckBGPPeeringPage: '<',
    diagnosticPageUrl: '<',
    user: '<',
    goToMigrateOffer: '<',
  },
  controller,
  template,
};
