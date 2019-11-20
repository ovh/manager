import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerDataProcessingJobDetailsDashboard';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.data-processing.job-details.dashboard.**', {
      url: '/dashboard',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector()
          .get('$ocLazyLoad');
        return import('./job-dashboard.module')
          .then(mod => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
