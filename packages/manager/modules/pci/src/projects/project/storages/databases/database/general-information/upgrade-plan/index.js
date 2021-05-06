import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'ovhManagerPciStoragesDatabaseGeneralInformationUpgradePlanLazyloading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'pci.projects.project.storages.databases.dashboard.general-information.upgrade-plan.**',
      {
        url: '/upgrade-plan',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./upgrade-plan.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
