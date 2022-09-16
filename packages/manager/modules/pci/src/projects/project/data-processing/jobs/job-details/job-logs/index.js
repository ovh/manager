import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import PciStoragesContainersService from '../../../../storages/containers/containers.service';

const moduleName = 'ovhManagerPciProjectDataProcessingJobLogsLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(
        'pci.projects.project.data-processing.jobs.job-details.logs.**',
        {
          url: '/logs',
          lazyLoad: ($transition$) => {
            const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
            return import('./job-logs.module').then((mod) =>
              $ocLazyLoad.inject(mod.default || mod),
            );
          },
        },
      );
    },
  )
  .service('PciStoragesContainersService', PciStoragesContainersService);

export default moduleName;
