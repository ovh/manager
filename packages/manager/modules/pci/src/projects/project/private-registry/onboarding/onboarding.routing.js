import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.private-registry.onboarding', {
      url: '/onboarding',
      component: 'pciProjectPrivateRegistryOnboarding',
      params: {
        registryId: null,
      },
      resolve: {
        registryId: /* @ngInject */ ($stateParams) => $stateParams.registryId,
        registryContracts: /* @ngInject */(
          $q,
          pciPrivateRegistryService,
        ) => pciPrivateRegistryService.getAgreements()
          .then((agreements) => {
            const agreementPromises = map(
              agreements || [],
              (agreement) => pciPrivateRegistryService.getContractInfo(agreement.id)
                .then((contract) => Object.assign(contract, {
                  id: agreement.id,
                  validated: agreement.validated,
                })),
            );
            return $q.all(agreementPromises);
          }),

        breadcrumb: () => null, // Hide breadcrumb
      },
    });
};
