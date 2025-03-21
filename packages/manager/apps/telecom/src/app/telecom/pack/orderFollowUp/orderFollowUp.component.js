import template from './orderFollowUp.html';
import controller from './orderFollowUp.controller';

export default {
  template,
  controller,
  controllerAs: 'OrderFollowUpCtrl',
  bindings: {
    packName: '<',
  },
};
