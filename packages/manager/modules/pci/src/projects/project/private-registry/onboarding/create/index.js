import angular from 'angular';
import component from '../../create';

const moduleName = 'pciProjectPrivateRegistryOnboardingCreateComponent';

angular.module(moduleName, [component])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.private-registry.onboarding.create', {
        url: '/create',
        views: {
          modal: {
            component: 'pciProjectPrivateRegistryCreate',
          },
        },
        layout: 'modal',
        backdrop: 'static',
        resolve: {
          acceptTermsAndConditions: () => false,
          goBack: /* @ngInject */  (goBackToOnboarding) => goBackToOnboarding,
        },
      });
  });

export default moduleName;
