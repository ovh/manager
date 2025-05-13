import template from './DATABASE.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.database', {
    url: '/database',
    template,
    controller: 'HostingTabDatabasesCtrl',
    controllerAs: '$ctrl',
    resolve: {
      goToDatabase: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
        target = 'app.alerts.main',
      ) => {
        const promise = $state.go('app.hosting.dashboard.database', {});

        if (message) {
          promise.then(() =>
            $timeout(() => Alerter.set(`alert-${type}`, message, null, target)),
          );
        }

        return promise;
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_database'),
    },
  });

  $stateProvider.state('app.hosting.dashboard.database.dashboard', {
    url: '/:name',
    template: '<div ui-view></div>',
    redirectTo: 'app.hosting.dashboard.database',
    resolve: {
      name: /* @ngInject */ ($transition$) => $transition$.params().name,
      breadcrumb: /* @ngInject */ (name) => name,
    },
  });
};
