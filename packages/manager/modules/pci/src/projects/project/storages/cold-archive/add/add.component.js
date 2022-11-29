import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    projectId: '<',
    guides: '<',
    checkPricesLink: '<',
    stepper: '<',
    userModel: '<',
    allUserList: '<',
    goToColdArchiveContainersWithMessage: '<',
    priceLink: '<',
  },
  controller,
  template,
};
