import controller from './datastore.controller';
import template from './datastore.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    trackingPrefix: '<',
    aiUsers: '<',
    goToObjectStorageUsers: '<',
    regions: '<',
    currentRegion: '<',
    aiDatastores: '<',
    s3Guides: '<',
    goToCreateDatastore: '<',
    goToDeleteDatastore: '<',
  },
};
