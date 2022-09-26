import controller from './add.controller';
import template from './add.html';

export default {
  bindings: {
    projectId: '<',
    checkPricesLink: '<',
    stepper: '<',
    userModel: '<',
    allUserList: '<',
    goToArchives: '<',
  },
  controller,
  template,
};
