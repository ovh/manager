import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'dedicatedCloudMailingListSubscribeLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('app.dedicatedClouds.dashboard.ml-subscribe.**', {
      url: '/ml-subscribe',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        return import(
          './dedicatedCloud-mailing-list-subscribe.module'
        ).then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  },
);

export default moduleName;
