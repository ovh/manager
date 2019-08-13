angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`ovh-angular-contact/src/ovh-angular-contact/translations/Messages_${$translate.use()}.xml`)
      .catch(() => import(`ovh-angular-contact/src/ovh-angular-contact/translations/Messages_${$translate.fallbackLanguage()}.xml`))
      .then(x => x.default),
  );
  $translate.refresh();
});
