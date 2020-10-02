angular
  .module('Module.license')
  .config(($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app.license', {
      url: '/license',
    template: '<ui-view/>',
    translations: { value: ['.'], format: 'json' },
  });
  $stateProvider.state('app.license.dashboard', {
    url: '',
    templateUrl: 'license/license.html',
    controller: 'LicenseCtrl',
    });

    $urlRouterProvider.when(/^\/configuration\/license/, () => {
      window.location.href = window.location.href.replace('/configuration', '');
  });
});
