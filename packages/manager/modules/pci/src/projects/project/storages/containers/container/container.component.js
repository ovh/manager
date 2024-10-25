import controller from './container.controller';
import template from './container.html';

export default {
  controller,
  template,
  bindings: {
    addObject: '<',
    archive: '<',
    container: '<',
    containerId: '<',
    defaultCriteria: '<?',
    defaultPassword: '<?',
    deleteObject: '<',
    goToAddUserOnObject: '<',
    goToStorageContainers: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    projectId: '<',
    refresh: '<',
    steins: '<',
    customerRegions: '<',
    containersRegions: '<',
    trackingPrefix: '<',
    trackEncryptionAction: '<',
    encryptionAvailable: '<',
    enableVersioning: '<',
    is3azAvailable: '<',
    isLocalzoneAvailable: '<',
    is3azAvailable: '<',
  },
};
