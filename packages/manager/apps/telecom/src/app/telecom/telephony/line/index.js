import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerTelecomTelephonyLineLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('telecom.telephony.billingAccount.line.**', {
      url: '/line/:serviceName',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import(/* webpackChunkName: "line" */ './line.module').then(
          (mod) => {
            return $ocLazyLoad.inject(mod.default || mod);
          },
        );
      },
    });
  },
);

export default moduleName;
