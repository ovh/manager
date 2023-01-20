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
    initGuides: '<',
    goToAddColdArchive: '<',
    goToColdArchiveContainers: '<',
    guides: '<',
    containers: '<',
    priceLink: '<',
  },
  template,
};
