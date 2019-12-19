angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`./translations/Messages_${$translate.use()}.json`)
      .catch(() => import(`./translations/Messages_${$translate.fallbackLanguage()}.json`))
      .then((x) => x.default),
  );
  $translate.refresh();
});
angular.module('managerApp').component('telephonyNumberOvhPabxSoundList', {
  templateUrl: 'components/telecom/telephony/group/number/feature/ovhPabx/sound/list/telephony-group-number-feature-ovh-pabx-sound-list.html',
  require: {
    numberCtrl: '^^?telephonyNumber',
    ovhPabxCtrl: '^^?telephonyNumberOvhPabx',
  },
  bindings: {
    ovhPabx: '=?ovhPabx',
    selectedSound: '=?ngModel',
    withChoice: '<?',
    onSoundSelected: '&?',
  },
  controller: 'telephonyNumberOvhPabxSoundListCtrl',
});
