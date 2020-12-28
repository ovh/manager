import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'dedicatedCloudLicenseEnableLegacyLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.license.enable-legacy.**', {
      url: '/enable-legacy',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import(
          './dedicatedCloud-license-enable-legacy.module'
        ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  },
);

export default moduleName;
