angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`./translations/Messages_${$translate.use()}.json`)
      .catch(() => import(`./translations/Messages_${$translate.fallbackLanguage()}.json`))
      .then((x) => x.default),
  );
  $translate.refresh();
});
angular.module('managerApp').component('telephonyNumberOvhPabxMenuList', {
  templateUrl: 'components/telecom/telephony/group/number/feature/ovhPabx/menu/list/telephony-group-number-feature-ovh-pabx-menu-list.html',
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
  controller: 'telephonyNumberOvhPabxMenuListCtrl',
});
