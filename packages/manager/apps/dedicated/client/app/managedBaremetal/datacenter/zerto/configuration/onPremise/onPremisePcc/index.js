import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'managedBaremetalDatacenterZertoOnPremiseOnPremisePccStepLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.managedBaremetal.details.datacenters.datacenter.zerto.onPremise.onPremisePccStep.**',
      {
        url: '/onPremisePcc',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./onPremisePccStep.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
