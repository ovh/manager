import { redirectTo as pendingTaskRedirectTo } from '../ola-pending-task/ola-pending-task.routing';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.interfaces.ola-reset', {
    url: '/ola-reset',
    views: {
      modal: {
        component: 'dedicatedServerInterfacesOlaReset',
      },
    },
    layout: 'modal',
    redirectTo: (transition) => {
      const injector = transition.injector();
      return injector.getAsync('ola').then((ola) => {
        return ola.isConfigured()
          ? pendingTaskRedirectTo(transition)
          : 'app.dedicated-server.server.interfaces';
      });
    },
    resolve: {
      goBack: /* @ngInject */ ($state) => (reload = false) =>
        $state.go('app.dedicated-server.server.interfaces', {}, { reload }),
      trackingPrefix: () => 'dedicated::server::interfaces::ola-reset::',
    },
  });
};
