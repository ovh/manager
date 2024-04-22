export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network-security.scrubbing-center', {
    url: '/scrubbing-center?cursors',
    component: 'scrubbingCenter',
    params: {
      ip: null,
      cursors: {
        array: false,
        dynamic: true,
        inherit: false,
        squash: true,
        type: 'cursors',
        value: null,
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('network_security_dashboard_breadcrumb'),
      cursors: /* @ngInject */ ($transition$) => $transition$.params().cursors,
      showStats: /* @ngInject */ (goTo, atInternet) => (row) => {
        atInternet.trackClick({
          name: 'network-security::scrubbing-log::details',
          type: 'action',
        });
        goTo({
          name: 'network-security.traffic',
          params: { subnet: row.subnet },
        });
      },
      getIp: /* @ngInject */ ($state) => () => $state.params.ip,
    },
  });
};
