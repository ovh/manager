angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`./translations/Messages_${$translate.use()}.json`)
      .catch(() =>
        import(`./translations/Messages_${$translate.fallbackLanguage()}.json`),
      )
      .then((x) => x.default),
  );
  $translate.refresh();
});
angular.module('managerApp').component('telephonyNumberConference', {
  templateUrl:
    'components/telecom/telephony/group/number/feature/conference/telephony-group-number-feature-conference.html',
  require: {
    numberCtrl: '^telephonyNumber',
  },
  controller: 'TelephonyNumberConferenceCtrl',
});
