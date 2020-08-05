import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerTelephonyLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('telecom.telephony', {
        url: '/telephony',
        views: {
          'telecomView@telecom': {
            template: `<section
              class="telecom-legacy telecom-telephony"
              data-ui-view="telephonyView"
          ></section>`,
          },
        },
        redirectTo: 'telecom.telephony.index',
      })
      .state('telecom.telephony.index.**', {
        url: '',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./telephony.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      })
      .state('telecom.telephony.billingAccount.**', {
        url: '/:billingAccount',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./telephony.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
  },
);
export default moduleName;
