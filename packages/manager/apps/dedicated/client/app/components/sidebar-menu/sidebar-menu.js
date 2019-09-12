angular.module('App').run(($translate, asyncLoader) => {
  // asyncLoader.addTranslations(
  // import(`ovh-angular-sidebar-menu/src/ovh-angular-sidebar-menu
  // /translations/Messages_${$translate.use()}.json`)
  // .then(x => x.default));
  asyncLoader.addTranslations(import(`./translations/Messages_${$translate.use()}.json`).then(x => x.default));
  asyncLoader.addTranslations(import(`./account/translations/Messages_${$translate.use()}.json`).then(x => x.default));
  $translate.refresh();
});
