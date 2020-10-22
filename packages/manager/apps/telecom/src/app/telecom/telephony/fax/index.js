import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerTelecomTelephonyFaxLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('telecom.telephony.billingAccount.fax.**', {
      url: '/fax/:serviceName',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import(/* webpackChunkName: "fax" */ './fax.module').then(
          (mod) => {
            return $ocLazyLoad.inject(mod.default || mod);
          },
        );
      },
    });
  },
);

export default moduleName;
