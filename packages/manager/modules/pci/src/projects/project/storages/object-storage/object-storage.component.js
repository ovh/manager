import template from './object-storage.html';
import controller from './object-storage.controller';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    isUserTabActive: '<',
    containers: '<',
    userList: '<',
    allUserList: '<',
    customerRegions: '<',
    containersRegions: '<',
    containersLink: '<',
    userListLink: '<',
    onGuideLinkClick: '<',
    trackingPrefix: '<',
    tagPageParams: '<',
    trackPage: '<',
  },
  template,
  controller,
};
