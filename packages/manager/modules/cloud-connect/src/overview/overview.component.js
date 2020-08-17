import controller from './overview.controller';
import template from './template.html';

export default {
  bindings: {
    cloudConnect: '<',
    datacenters: '<',
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
    user: '<',
  },
  controller,
  template,
};
