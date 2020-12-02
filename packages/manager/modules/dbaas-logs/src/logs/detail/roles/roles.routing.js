export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.roles', {
    url: '/roles',
    views: {
      logsContent: 'dbaasLogsDetailRoles',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_roles'),
    },
  });

  $stateProvider.state('dbaas-logs.detail.roles.role', {
    url: '/:roleId',
    redirectTo: 'dbaas-logs.detail.roles',
    views: {
      'logsContent@dbaas-logs.detail': {
        template: '<div ui-view></div>',
      },
    },
    resolve: {
      roleId: /* @ngInject */ ($transition$) => $transition$.params().roleId,
      breadcrumb: /* @ngInject */ (roleId) => roleId,
    },
  });
};
