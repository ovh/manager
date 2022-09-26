import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPciStoragesLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('pci.projects.project.storages.**', {
      url: '/storages',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        const objectStorageId = 'public-cloud:object-storage';
        const promise = $transition$
          .injector()
          .get('ovhFeatureFlipping')
          .checkFeatureAvailability(objectStorageId)
          .then((newRegionFeature) =>
            newRegionFeature.isFeatureAvailable(objectStorageId),
          )
          .then((status) =>
            status
              ? import('./storages.module')
              : import('./legacy/storages.module'),
          );
        return promise.then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  },
);

export default moduleName;
