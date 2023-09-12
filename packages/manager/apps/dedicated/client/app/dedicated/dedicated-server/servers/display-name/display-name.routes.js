angular.module('App').config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicated-server.server.dashboard.edit-display-name',
      {
        url: '/display-name',
        controller: 'DisplayNameCtrl',
        templateUrl: 'dedicated/server/display-name/display-name.html',
        layout: 'modal',
        translations: { value: ['.'], format: 'json' },
        resolve: {
          breadcrumb: () => null,
        },
      },
    );
  },
);
