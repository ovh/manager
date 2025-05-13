import template from './extension.html';
import controller from './extension.controller';

export default {
  template,
  controller,
  bindings: {
    extension: '=',
  },
  require: {
    numberCtrl: '^^telephonyNumber',
    ovhPabxCtrl: '^^telephonyNumberOvhPabx',
    dialplanCtrl: '^^telephonyNumberOvhPabxDialplan',
  },
};
