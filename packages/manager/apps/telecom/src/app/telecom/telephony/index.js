import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

import billingAccount from './billingAccount';

import './telecom-telephony.less';

const moduleName = 'ovhManagerTelecomTelephonyLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad', billingAccount]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('telecom.telephony', {
        url: '/telephony',
        redirectTo: 'telecom.telephony.index',
        views: {
          'telecomView@telecom': {
            template:
              '<div class="telecom-telephony" ui-view="telephonyView"></div>',
          },
        },
      })
      .state('telecom.telephony.index.**', {
        url: '',
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
