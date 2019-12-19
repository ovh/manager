angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`./translations/Messages_${$translate.use()}.json`)
      .catch(() => import(`./translations/Messages_${$translate.fallbackLanguage()}.json`))
      .then((x) => x.default),
  );

  asyncLoader.addTranslations(
    import(`./types/cloudHunting/translations/Messages_${$translate.use()}.json`)
      .catch(() => import(`./types/cloudHunting/translations/Messages_${$translate.fallbackLanguage()}.json`))
      .then((x) => x.default),
  );

  asyncLoader.addTranslations(
    import(`./types/cloudIvr/translations/Messages_${$translate.use()}.json`)
      .catch(() => import(`./types/cloudIvr/translations/Messages_${$translate.fallbackLanguage()}.json`))
      .then((x) => x.default),
  );

  asyncLoader.addTranslations(
    import(`./types/contactCenterSolutionExpert/translations/Messages_${$translate.use()}.json`)
      .catch(() => import(`./types/contactCenterSolutionExpert/translations/Messages_${$translate.fallbackLanguage()}.json`))
      .then((x) => x.default),
  );

  $translate.refresh();
});
angular.module('managerApp').component('telephonyNumberOvhPabx', {
  templateUrl: 'components/telecom/telephony/group/number/feature/ovhPabx/telephony-group-number-feature-ovh-pabx.html',
  require: {
    numberCtrl: '^^telephonyNumber',
  },
  controller: 'TelephonyNumberOvhPabxCtrl',
});
