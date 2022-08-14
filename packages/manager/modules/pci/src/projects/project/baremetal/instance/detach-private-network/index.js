import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

const moduleName =
  'ovhManagerPciBaremetalInstanceDetachPrivateNetworkLazyLoading';

angular.module(moduleName, ['ui.router', 'oc.lazyLoad']).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'pci.projects.project.baremetal.instance.detachPrivateNetwork.**',
      {
        url: '/network/private/detach',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./detach-private-network.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      },
    );
  },
);

export default moduleName;
