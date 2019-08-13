angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`ovh-angular-sidebar-menu/src/ovh-angular-sidebar-menu/translations/Messages_${$translate.use()}.xml`)
      .catch(() => import(`ovh-angular-sidebar-menu/src/ovh-angular-sidebar-menu/translations/Messages_${$translate.fallbackLanguage()}.xml`))
      .then(x => x.default),
  );

  $translate.refresh();
});
