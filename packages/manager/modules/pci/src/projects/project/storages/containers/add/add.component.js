import controller from './add.controller';
import template from './add.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    archive: '<',
    regions: '<',
    goBack: '<',
    cancelCreate: '<',
    trackingPrefix: '<',
    user: '<',
    allUserList: '<',
    redirectTarget: '<',
    goBackWithTrackingPage: '<',
    trackPage: '<',
    isDiscoveryProject: '<',
    goToDiscoveryProjectActivationPage: '&',
    encryptionAvailable: '<',
    encryptionAlgorithms: '<',
    trackEncryptionAction: '<',
    catalog: '<',
    is3azAvailable: '<',
  },
};
