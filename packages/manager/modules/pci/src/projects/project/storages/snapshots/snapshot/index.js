import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPciStoragesSnapshotsSnapshotLazyLoading';

angular
  .module(moduleName, [
    'ui.router',
    'oc.lazyLoad',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.storages.snapshots.snapshot.**', {
      url: '/{snapshotId}',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

        return import('./snapshot.module')
          .then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  });

export default moduleName;
