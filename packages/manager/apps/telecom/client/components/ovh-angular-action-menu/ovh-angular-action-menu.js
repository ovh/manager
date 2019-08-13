angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`ovh-angular-actions-menu/src/ovh-angular-actions-menu/translations/Messages_${$translate.use()}.xml`)
      .catch(() => import(`ovh-angular-actions-menu/src/ovh-angular-actions-menu/translations/Messages_${$translate.fallbackLanguage()}.xml`))
      .then(x => x.default),
  );

  $translate.refresh();
});
