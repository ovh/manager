import template from './dialplan.html';
import controller from './dialplan.controller';

export default {
  template,
  controller,
  bindings: {
    dialplan: '=telephonyNumberOvhPabxDialplan',
  },
  require: {
    numberCtrl: '^^telephonyNumber',
    ovhPabxCtrl: '^^telephonyNumberOvhPabx',
  },
};
