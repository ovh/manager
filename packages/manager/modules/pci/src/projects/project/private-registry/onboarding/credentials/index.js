import angular from 'angular';
import component from '../../credentials';

const moduleName = 'pciProjectPrivateRegistryOnboardingCredentialsComponent';

angular.module(moduleName, [component]).config(
  /* @ngInject */ ($stateProvider) => {
    $stateProvider.state(
      'pci.projects.project.private-registry.onboarding.credentials',
      {
        url: '/:registryId/credentials',
        layout: 'modal',
        views: {
          modal: {
            component: 'pciPrivateRegistryCredentials',
          },
        },
        resolve: {
          confirmationRequired: () => false,
          goBack: /* @ngInject */ (goBackToOnboarding) => goBackToOnboarding,
          goToList: /* @ngInject */ (goBackToList) => goBackToList,
          registry: /* @ngInject */ (
            projectId,
            pciPrivateRegistryService,
            $stateParams,
          ) =>
            pciPrivateRegistryService.getRegistry(
              projectId,
              $stateParams.registryId,
            ),
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('private_registry_generate_credentials'),
        },
      },
    );
  },
);

export default moduleName;
