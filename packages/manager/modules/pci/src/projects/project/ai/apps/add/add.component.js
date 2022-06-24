import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    projectId: '<',
    storageAddObjectLink: '<',
    goToApps: '<',
    createToken: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    onAppAdd: '<',
    trackApps: '<',
    trackClick: '<',
    regions: '<',
    flavors: '<',
    storages: '<',
    prices: '<',
    getPriceIndex: '<',
  },
  controller,
  template,
};
