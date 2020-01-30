angular.module('managerApp').run(($translate, asyncLoader) => {
  asyncLoader.addTranslations(
    import(`./translations/Messages_${$translate.use()}.json`).then(
      (x) => x.default,
    ),
  );
  $translate.refresh();
});
