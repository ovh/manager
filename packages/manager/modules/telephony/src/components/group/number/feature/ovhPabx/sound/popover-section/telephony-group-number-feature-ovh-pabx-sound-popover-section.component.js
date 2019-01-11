(function () {
  angular.module('managerApp').run(($translate, asyncLoader) => {
    asyncLoader.addTranslations(
      import(`./translations/Messages_${$translate.use()}.xml`)
        .catch(() => import(`./translations/Messages_${$translate.fallbackLanguage()}.xml`))
        .then(x => x.default),
    );
    $translate.refresh();
  });
  angular.module('managerApp').component('telephonyNumberOvhPabxSoundPopoverSection', {
    templateUrl: 'components/telecom/telephony/group/number/feature/ovhPabx/sound/popover-section/telephony-group-number-feature-ovh-pabx-sound-popover-section.html',
    require: {
      numberCtrl: '^^?telephonyNumber',
    },
    bindings: {
      ovhPabx: '=?',
      selectedSoundId: '=',
      onSoundChange: '&',
    },
    controller: 'telephonyNumberOvhPabxSoundPopoverSectionCtrl',
  });
}());
