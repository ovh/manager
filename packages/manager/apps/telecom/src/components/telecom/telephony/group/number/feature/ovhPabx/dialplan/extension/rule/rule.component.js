import template from './rule.html';
import controller from './rule.controller';

export default {
  template,
  controller,
  bindings: {
    rule: '=',
    hideActions: '<',
  },
  require: {
    numberCtrl: '^^telephonyNumber',
    ovhPabxCtrl: '^^telephonyNumberOvhPabx',
    dialplanCtrl: '^^telephonyNumberOvhPabxDialplan',
    extensionCtrl: '^^telephonyNumberOvhPabxDialplanExtension',
  },
};
