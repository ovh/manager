import template from './menu.html';
import controller from './menu.controller';

export default {
  template,
  controller,
  require: {
    numberCtrl: '^^?telephonyNumber',
    dialplanCtrl: '^^?telephonyNumberOvhPabxDialplan',
    extensionCtrl: '^^?telephonyNumberOvhPabxDialplanExtension',
    menuCtrl: '^^?telephonyNumberOvhPabxMenu',
  },
  bindings: {
    ovhPabx: '=?ovhPabx',
    jsplumbInstance: '=?ovhPabxMenuJsplumbInstance',
    menu: '=ovhPabxMenu',
    menuEntry: '=?ovhPabxMenuEntry',
    dialplanRule: '=?dialplanRule',
  },
};
