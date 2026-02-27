import { init, loadRemote } from '@module-federation/runtime';

const isStagingEnvironment = /\.dtci\./.test(window.location.hostname);
const isLocal = /localhost|127\.0\.0\.1/.test(window.location.hostname);

const getOrderUrl = () => {
  if (isStagingEnvironment) {
    return 'https://ovhcloudcomdev.static.ovh.net/order/builder/assets/remoteEntry.js';
  }

  // Run module federation in local mode
  if (isLocal) {
    return 'http://localhost:5001/assets/remoteEntry.js';
  }

  // Default URL
  return '/order/builder/assets/remoteEntry.js';
};

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
              name: 'iplb_pack',
              alias: 'order_fm',
              type: 'module',
              entry: getOrderUrl(),
            },
          ],
        });
        return loadRemote('order_fm/iplb_pack');
      },
    },
  });
};
