import { redirectTo } from '../ola-pending-task/ola-pending-task.routing';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.interfaces.ola-configuration', {
    url: '/ola-configuration',
    translations: { value: ['.'], format: 'json' },
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerInterfacesOlaConfiguration',
      },
    },
    redirectTo,
    resolve: {
      goBack: /* @ngInject */ ($state) => (params) =>
        $state.go('app.dedicated.server.interfaces', params, { reload: true }),
      trackingPrefix: () =>
        'dedicated::server::interfaces::ola-configuration::',
    },
  });
};
