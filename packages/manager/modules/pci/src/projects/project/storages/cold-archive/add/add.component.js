import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    projectId: '<',
    guideMenu: '<',
    initGuides: '<',
    checkPricesLink: '<',
    onPriceLinkClick: '<',
    onGuideClick: '<',
    stepper: '<',
    userModel: '<',
    allUserList: '<',
    priceLink: '<',
    goToColdArchiveContainers: '<',
  },
  controller,
  template,
};
