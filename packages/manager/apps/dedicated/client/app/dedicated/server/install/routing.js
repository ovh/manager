import component from './component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.install', {
    url: '/install',
    views: {
      '@app.dedicated': {
        component: component.name,
      },
    },
    resolve: {
      getInstallationTypeHref: /* @ngInject */ ($state) => (installationType) =>
        $state.href(`app.dedicated.server.install.${installationType}`),
    },
  });
};
