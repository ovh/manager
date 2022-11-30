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
    priceLink: '<',
    goToColdArchiveContainers: '<',
  },
  controller,
  template,
};
