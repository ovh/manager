import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';


const moduleName = 'ovhManagerPciStreamsStreamSubscriptionsLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.streams.stream.subscriptions.**', {
      url: '/subscriptions',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./subscriptions.module')
          .then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
