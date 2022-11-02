import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName = 'ovhManagerPciPrivateNetworksLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state('pci.projects.project.privateNetwork.**', {
      url: '/private-networks',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
        const promise =
          $transition$
            .injector()
            .get('coreConfig')
            .getRegion() !== 'US'
            ? import('./private-networks.module')
            : import('./legacy/private-networks.module');
        return promise.then((mod) => $ocLazyLoad.inject(mod.default || mod));
      },
    });
  },
);

export default moduleName;
