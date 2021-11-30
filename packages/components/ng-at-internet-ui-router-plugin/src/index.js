import angular from 'angular';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';

import '@ovh-ux/ng-at-internet';
import '@uirouter/angularjs';

import provider from './provider';

const moduleName = 'ngAtInternetUiRouterPlugin';

/**
 * @ngdoc overview
 * @name atInternetUiRouterPlugin
 * @description
 * # atInternetUiRouterPlugin
 *
 * Plugin for at-internet when using ui-router
 */
angular
  .module(moduleName, ['ngAtInternet', 'ui.router'])
  .config(
    /* @ngInject */ ($transitionsProvider) => {
      $transitionsProvider.onBefore({}, (transition) => {
        transition.addResolvable({
          token: 'atInternetStateDecorator',
          deps: ['$injector', 'atInternet', 'atInternetUiRouterPlugin'],
          resolveFn($injector, atInternet, atInternetUiRouterPlugin) {
            const state = transition.to();
            const options = state.atInternet;
            const ignore = options && options.ignore;
            const trackPage = {};
            if (atInternetUiRouterPlugin.isStateTrackEnabled() && !ignore) {
              trackPage.pageUrl = encodeURIComponent(
                transition.router.stateService.href(
                  state.name,
                  transition.params(),
                  { absolute: true },
                ),
              );
              trackPage.name = state.name;
              if (options) {
                if (options.rename) {
                  trackPage.name = options.rename;

                  if (
                    angular.isFunction(options.rename) ||
                    isArray(options.rename)
                  ) {
                    trackPage.name = $injector.invoke(options.rename);
                  }
                }
                if (options.level2) {
                  trackPage.level2 = options.level2;
                  if (angular.isFunction(options.level2)) {
                    trackPage.level2 = $injector.invoke(options.level2);
                  }
                }
              }

              // apply state filters if any
              forEach(atInternetUiRouterPlugin.getStateFilters(), (filter) => {
                if (isFunction(filter)) {
                  trackPage.name = filter.apply(null, [trackPage.name]);
                }
              });
              if (trackPage.name) {
                atInternet.trackPage(trackPage);
              }
            }
          },
        });
        return transition;
      });
    },
  )
  .provider('atInternetUiRouterPlugin', provider);

export default moduleName;
