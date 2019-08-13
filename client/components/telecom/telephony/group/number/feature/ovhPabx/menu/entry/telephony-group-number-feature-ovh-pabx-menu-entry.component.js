(function () {
  angular.module('managerApp').component('telephonyNumberOvhPabxMenuEntry', {
    templateUrl: 'components/telecom/telephony/group/number/feature/ovhPabx/menu/entry/telephony-group-number-feature-ovh-pabx-menu-entry.html',
    require: {
      menuCtrl: '^^telephonyNumberOvhPabxMenu',
      menuEntryCtrl: '^^?telephonyNumberOvhPabxMenuEntry',
      extensionCtrl: '^^?telephonyNumberOvhPabxDialplanExtension',
    },
    bindings: {
      menuEntry: '=',
    },
    controller: 'telephonyNumberOvhPabxMenuEntryCtrl',
  });
}());
