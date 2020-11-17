import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'managedBaremetalDatacenterDrpOnPremiseOvhPccStepLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'app.managedBaremetal.datacenter.drp.onPremise.ovhPccStep.**',
      {
        url: '/ovhPcc',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          return import('./ovhPccStep.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
