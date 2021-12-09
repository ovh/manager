import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'ovhManagerPciStoragesDatabaseGeneralInformationReplicationsDeleteReplicationLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'pci.projects.project.storages.databases.dashboard.replications.delete-replication.**',
      {
        url: '/delete-replication',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./delete-replication.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
