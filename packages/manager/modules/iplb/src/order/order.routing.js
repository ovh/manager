import { init, loadRemote } from '@module-federation/runtime';
import { REMOTE_ENTRY_URLS } from './order.constants';

const getOrderUrl = (hostname) => {
  if (hostname.includes('.us.') || hostname.includes('-us.')) {
    return REMOTE_ENTRY_URLS.US;
  }
  if (hostname.includes('.ca.') || hostname.includes('-ca.')) {
    return REMOTE_ENTRY_URLS.CA;
  }
  // Default to EU for localhost and EU environments
  return REMOTE_ENTRY_URLS.EU;
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
      setupIpLb: /* @ngInject */ ($window) => {
        const { hostname } = $window.location;

        init({
          remotes: [
            {
              name: 'iplb_pack',
              alias: 'order_fm',
              type: 'module',
              entry: getOrderUrl(hostname),
            },
          ],
        });
        return loadRemote('order_fm/iplb_pack');
      },
    },
  });
};
