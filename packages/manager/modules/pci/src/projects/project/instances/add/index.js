import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import instanceWorkflow from '../../workflow/add/add.module';

const moduleName = 'ovhManagerPciInstancesAddLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', instanceWorkflow])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('pci.projects.project.instances.add.**', {
        url: '/new',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          const promise =
            $transition$
              .injector()
              .get('coreConfig')
              .getRegion() !== 'US'
              ? import('./add.module')
              : import('./legacy/add.module');
          return promise.then((mod) => $ocLazyLoad.inject(mod.default || mod));
        },
      });
    },
  );

export default moduleName;
