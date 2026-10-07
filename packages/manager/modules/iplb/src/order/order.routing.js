import get from 'lodash/get';

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

        // `loadRemote` resolves the module *namespace*, not the module's
        // function: the federated entry of the configo is a default export
        // (`react-order`, src/configos/iplb/federation/
        // vite-module-federation-pack.ts). Returning the namespace left the
        // component with a non-callable binding, so `this.setupIpLb(element,
        // ...)` threw `setupIpLb is not a function` in $onInit and the page
        // stayed blank — the order form never mounted (MANAGER-22850).
        // Shaped exactly like the billing configo loader, and for two
        // toolchain reasons rather than style:
        //  - `get` instead of `?.`: the legacy webpack pipeline's acorn plugin
        //    rejects optional chaining in this position;
        //  - `.then` instead of `async`: an `async` function is wrapped by the
        //    babel transform, which drops the `/* @ngInject */` annotation, so
        //    AngularJS falls back to inferring DI from the minified parameter
        //    names and throws `Unknown provider: _xProvider <- _x`.
        return loadRemote('order_fm/iplb_pack').then((remote) =>
          get(remote, 'default', remote),
        );
      },
    },
  });
};
