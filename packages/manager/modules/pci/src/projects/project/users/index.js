import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import service from '../storages/object-storage/object-storage.service';

const moduleName = 'ovhManagerPciUsersLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('pci.projects.project.users.**', {
        url: '/users',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./users.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  )
  .service('PciStoragesObjectStorageService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
