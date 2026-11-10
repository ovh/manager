import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import ngOvhProxyRequest from '@ovh-ux/ng-ovh-proxy-request';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';
import ngOvhUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ovhContacts from '@ovh-ux/ng-ovh-contacts';
import 'bootstrap';
import 'angular-ui-bootstrap';
import 'punycode';
/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!ipaddr.js/ipaddr.min.js';
import 'ovh-api-services';
import { ACCOUNT_READ_ONLY, isAccountWriteRequest } from './account.constants';

const moduleName = 'ovhManagerAccountLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
    'ovh-api-services',
    ngAtInternetUiRouterPlugin,
    ngOvhApiWrappers,
    ngOvhHttp,
    ngOvhProxyRequest,
    ngOvhSwimmingPoll,
    ngOvhUiRouterLayout,
    ngOvhUserPref,
    ngOvhUtils,
    ngTranslateAsyncLoader,
    ngPaginationFront,
    ovhContacts,
    ovhManagerAtInternetConfiguration,
  ])
  .config(
    /* @ngInject */ ($httpProvider) => {
      if (!ACCOUNT_READ_ONLY) return;
      // Safety net behind the disabled UI: any write sent from the account
      // section is rejected before reaching the API, as a 403-like response so
      // the existing error handlers display it.
      $httpProvider.interceptors.push(
        /* @ngInject */ ($q) => ({
          request: (config) =>
            isAccountWriteRequest(config)
              ? $q.reject({
                  config,
                  status: 403,
                  statusText: 'Forbidden',
                  data: { message: 'Account edition is suspended.' },
                  headers: () => null,
                })
              : config,
        }),
      );
    },
  )
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('account.**', {
        url: '/',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./account.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
