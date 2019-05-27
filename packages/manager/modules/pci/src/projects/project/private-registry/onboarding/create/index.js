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
        params: {
          fromState: null,
        },
        layout: 'modal',
        backdrop: 'static',
        resolve: {
          goBack: /* @ngInject */  goBackToState => goBackToState,
        },
      });
  });

export default moduleName;
