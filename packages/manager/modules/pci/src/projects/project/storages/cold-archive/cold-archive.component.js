import template from './cold-archive.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    trackClick: '<',
    trackPage: '<',
    isUserTabActive: '<',
    userList: '<',
    allUserList: '<',
    userListLink: '<',
    archivesLink: '<',
    goToArchives: '<',
    goToAddColdArchive: '<',
    trackingPrefix: '<',
  },
  template,
};
