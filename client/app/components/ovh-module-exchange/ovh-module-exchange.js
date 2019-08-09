angular.module('App').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(import(`ovh-module-exchange/src/exchange/translations/Messages_${$translate.use()}.xml`).then(x => x.default));
  $translate.refresh();
});
