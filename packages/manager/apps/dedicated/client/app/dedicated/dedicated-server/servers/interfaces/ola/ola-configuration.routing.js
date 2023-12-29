import { redirectTo } from './ola-pending-task.routing';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.interfaces.ola-configuration',
    {
      url: '/ola-configuration',
      views: {
        'tabView@app.dedicated-server.server': {
          component: 'dedicatedServerInterfacesOlaConfiguration',
        },
      },
      redirectTo,
      resolve: {
        goBack: /* @ngInject */ ($state) => (params) =>
          $state.go('app.dedicated-server.server.interfaces', params, {
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
