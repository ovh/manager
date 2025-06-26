import { init, loadRemote } from '@module-federation/runtime';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('iplb.order', {
    url: '/order',
    views: {
      iplbContainer: {
        component: 'iplbOrderComponent',
      },
    },
    resolve: {
      hideBreadcrumb: () => true,
      ipLbPublicUrl: /* @ngInject */ ($injector) =>
        $injector.get('shellClient').navigation.getURL('dedicated', `#/iplb`),
      setupIpLb: /* @ngInject */ () => {
        init({
          remotes: [
            {
              name: '@order/ConfigoIplbPack',
              alias: 'order_fm',
              type: 'module',
              entry:
                'https://www.ovhcloud.com/order/configos/assets/remoteEntry.js',
            },
          ],
        });
        return loadRemote('order_fm/ConfigoIplbPack');
      },
    },
  });
};
