angular.module('App').config(($stateProvider, $urlRouterProvider) => {
  $stateProvider.state('app', {
    abstract: true,
    url: '',
    controller: 'AppCtrl',
    controllerAs: 'AppCtrl',
    templateUrl: 'app.html',
    translations: { value: ['./core', './common'], format: 'json' },
    resolve: {
      isEmailDomainAvailable: /* @ngInject */ (coreConfig) =>
        coreConfig.isRegion('EU'),
      rootState: () => 'app.configuration',
      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),
    },
  });

  $stateProvider.state('app.microsoft', {
    abstract: true,
    template: '<div ui-view></div>',
  });

  $urlRouterProvider.when(/^\/configuration\/email_domain/, () => {
    window.location.href = window.location.href.replace(
      '/configuration/email_domain',
      '/email_domain',
    );
  });
});
