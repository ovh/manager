import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    projectId: '<',
    guideMenu: '<',
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
