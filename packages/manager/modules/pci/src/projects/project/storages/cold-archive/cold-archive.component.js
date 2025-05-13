import template from './cold-archive.html';
import controller from './cold-archive.controller';

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
    goToColdArchiveContainersWithData: '<',
    guideMenu: '<',
    initGuides: '<',
    containers: '<',
    priceLink: '<',
    onPriceLinkClick: '<',
    onGuideClick: '<',
    regions: '<',
  },
  template,
  controller,
};
