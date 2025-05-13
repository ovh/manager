import controller from './configure-users.controller';
import template from './configure-users.html';

export default {
  bindings: {
    hasDefaultMeansOfPayment: '<',
    usersWhoCanReceiveSMS: '<',
  },
  controller,
  name: 'ovhManagerPccServicePackUpgradeConfigureUsers',
  require: {
    stepper: '^ovhManagerComponentStepper',
  },
  template,
};
