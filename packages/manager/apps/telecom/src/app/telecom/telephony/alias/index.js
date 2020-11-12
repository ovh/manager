import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerTelecomTelephonyAliasLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    const lazyLoad = ($transition$) => {
      const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

      return import(
        /* webpackChunkName: "alias" */ './alias.module'
      ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
    };

    $stateProvider.state('telecom.telephony.billingAccount.alias.**', {
      url: '/alias/:serviceName',
      lazyLoad,
    });

    $stateProvider.state(
      'telecom.telephony.billingAccount.portabilityOrder.**',
      {
        url: '/portabilityOrder',
        lazyLoad,
      },
    );
  },
);

export default moduleName;
