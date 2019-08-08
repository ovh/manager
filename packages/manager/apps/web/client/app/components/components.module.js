angular.module('App').run(($translate, $translatePartialLoader) => {
  $translatePartialLoader.addPart('common');
  $translate.refresh();
});
