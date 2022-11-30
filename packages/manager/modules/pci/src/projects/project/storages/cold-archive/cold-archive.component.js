import template from './cold-archive.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    trackClick: '<',
    trackPage: '<',
    isUserTabActive: '<',
    isUserColdArchiveContainersTabActive: '<',
    userList: '<',
    allUserList: '<',
    userListLink: '<',
    coldArchiveContainersLink: '<',
    goToAddColdArchive: '<',
    goToColdArchiveContainers: '<',
    trackingPrefix: '<',
    guides: '<',
    containers: '<',
    priceLink: '<',
  },
  template,
};
