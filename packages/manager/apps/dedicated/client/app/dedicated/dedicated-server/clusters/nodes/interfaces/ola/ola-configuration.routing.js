import { redirectTo } from './ola-pending-task.routing';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.interfaces.ola-configuration',
    {
      url: '/ola-configuration',
      views: {
        'tabView@app.dedicated-cluster.cluster.node': {
          component: 'dedicatedServerInterfacesOlaConfiguration',
        },
      },
      redirectTo,
      resolve: {
        goBack: /* @ngInject */ ($state) => (params) =>
          $state.go('app.dedicated-cluster.cluster.node.interfaces', params, {
            reload: true,
          }),
        trackingPrefix: () =>
          'dedicated::server::interfaces::ola-configuration::',
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('dedicated_server_interfaces_ola_title'),
      },
    },
  );
};
