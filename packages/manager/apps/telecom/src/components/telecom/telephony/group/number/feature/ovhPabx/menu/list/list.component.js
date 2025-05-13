import template from './list.html';
import controller from './list.controller';

export default {
  template,
  controller,
  require: {
    numberCtrl: '^^?telephonyNumber',
    ovhPabxCtrl: '^^?telephonyNumberOvhPabx',
  },
  bindings: {
    ovhPabx: '=?ovhPabx',
    selectedMenu: '=?ngModel',
    withChoice: '<?',
    radioName: '@?',
    disableMenuId: '<?',
    onMenuSelected: '&?',
  },
};
