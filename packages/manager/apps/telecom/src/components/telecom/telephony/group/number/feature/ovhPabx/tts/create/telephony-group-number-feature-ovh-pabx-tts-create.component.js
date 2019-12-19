angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`./translations/Messages_${$translate.use()}.json`)
      .catch(() => import(`./translations/Messages_${$translate.fallbackLanguage()}.json`))
      .then((x) => x.default),
  );
  $translate.refresh();
});
angular.module('managerApp').component('telephonyNumberOvhPabxTtsCreate', {
  templateUrl: 'components/telecom/telephony/group/number/feature/ovhPabx/tts/create/telephony-group-number-feature-ovh-pabx-tts-create.html',
  require: {
    numberCtrl: '^^?telephonyNumber',
    ovhPabxCtrl: '^^?telephonyNumberOvhPabx',
  },
  bindings: {
    ovhPabx: '=?ovhPabx',
    onTtsCreationCancel: '&?',
    onTtsCreationSuccess: '&?',
  },
  controller: 'telephonyNumberOvhPabxTtsCreateCtrl',
});
