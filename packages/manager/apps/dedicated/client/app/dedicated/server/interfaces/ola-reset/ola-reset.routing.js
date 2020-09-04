import { redirectTo as pendingTaskRedirectTo } from '../ola-pending-task/ola-pending-task.routing';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.interfaces.ola-reset', {
    url: '/ola-reset',
    translations: { value: ['.'], format: 'json' },
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
          : 'app.dedicated.server.interfaces';
      });
    },
    resolve: {
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicated.server.interfaces'),
    },
  });
};
