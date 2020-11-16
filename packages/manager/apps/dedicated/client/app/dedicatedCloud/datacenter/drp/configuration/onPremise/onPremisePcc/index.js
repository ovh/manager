import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'dedicatedCloudDatacenterDrpOnPremiseOnPremisePccStepLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.dedicatedClouds.datacenter.drp.onPremise.onPremisePccStep.**',
      {
        url: '/onPremisePcc',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import(
            './dedicatedCloud-datacenter-drp-onPremise-onPremisePccStep.module'
          ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      },
    );
  },
);

export default moduleName;
