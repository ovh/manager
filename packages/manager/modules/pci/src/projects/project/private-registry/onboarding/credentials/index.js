import angular from 'angular';
import component from '../../credentials';

const moduleName = 'pciProjectPrivateRegistryOnboardingCredentialsComponent';

angular.module(moduleName, [component])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.private-registry.onboarding.credentials', {
        url: '/credentials',
        layout: 'modal',
        params: {
          registryId: null,
          registryName: null,
          harborURL: null,
          confirmationRequired: null,
        },
        views: {
          modal: {
            component: 'pciPrivateRegistryCredentials',
          },
        },
        resolve: {
          goBack: /* @ngInject */  goBackToOnboarding => goBackToOnboarding,
          breadcrumb: /* @ngInject */ $translate => $translate.instant('private_registry_generate_credentials'),
        },
      });
  });

export default moduleName;
