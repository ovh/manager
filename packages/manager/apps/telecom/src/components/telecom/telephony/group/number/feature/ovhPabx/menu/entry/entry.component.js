import template from './entry.html';
import controller from './entry.controller';

export default {
  template,
  controller,
  require: {
    menuCtrl: '^^telephonyNumberOvhPabxMenu',
    menuEntryCtrl: '^^?telephonyNumberOvhPabxMenuEntry',
    extensionCtrl: '^^?telephonyNumberOvhPabxDialplanExtension',
  },
  bindings: {
    menuEntry: '=',
  },
};
