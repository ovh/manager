import template from './DUMPS.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.database.dashboard.dump', {
    url: '/dump',
    template,
    controller: 'DatabaseDumpsCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_database_dump'),
    },
  });
};
