import { init, loadRemote } from '@module-federation/runtime';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.order', {
    url: '/order',
    component: 'nashaOrder',
    resolve: {
      nashaPublicUrl: /* @ngInject */ ($injector) =>
        $injector.get('shellClient').navigation.getURL('dedicated', `#/nasha`),
      breadcrumb: () => null,
      goToNasha: /* @ngInject */ ($state) => () => $state.go('nasha'),
      setupNasHa: /* @ngInject */ () => {
        init({
          remotes: [
            {
              name: '@order/ConfigoNasHa',
              alias: 'order_fm',
              type: 'module',
              entry:
                'https://ovhcloudcomdev.static.ovh.net/order/configos/assets/remoteEntry.js',
            },
          ],
        });
        return loadRemote('order_fm/ConfigoNasHa');
      },
    },
  });
};
