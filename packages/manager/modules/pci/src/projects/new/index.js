import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';
import featureFlippling from './components/feature-flipping';

const moduleName = 'ovhManagerPciProjectsNewLazyLoading';

angular
  .module(moduleName, ['ui.router', 'oc.lazyLoad', featureFlippling])
  .config((ovhPciFeatureFlippingProvider) => {
    ovhPciFeatureFlippingProvider.addFeatures([
      {
        key: 'pci.onboarding.new',
        name: 'New PCI onboarding',
        description: 'Show the new PCI project creation',
        active: {
          region: ['EU', 'CA'],
        },
      },
      {
        key: 'pci.onboarding.new.banner',
        name: 'New PCI onboarding banner',
        description: 'Show the promo code banner in new PCI project creation',
        active: false,
      },
    ]);
  })
  .config(
    /* @ngInject */ ($stateProvider, ovhPciFeatureFlippingProvider) => {
      $stateProvider.state('pci.projects.new.**', {
        url: '/new',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
          let loadPromise;

          if (
            ovhPciFeatureFlippingProvider.isFeatureActive('pci.onboarding.new')
          ) {
            loadPromise = import('./module');
          } else {
            loadPromise = import('./legacy/module');
          }

          return loadPromise.then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
