import template from './create.html';
import controller from './create.controller';

export default {
  template,
  controller,
  require: {
    numberCtrl: '^^?telephonyNumber',
    ovhPabxCtrl: '^^?telephonyNumberOvhPabx',
  },
  bindings: {
    ovhPabx: '=?ovhPabx',
    onTtsCreationCancel: '&?',
    onTtsCreationSuccess: '&?',
  },
};
