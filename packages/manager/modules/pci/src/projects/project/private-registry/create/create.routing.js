import map from 'lodash/map';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.private-registry.create', {
      url: '/create',
      views: {
        modal: {
          component: 'pciProjectPrivateRegistryCreate',
        },
      },
      layout: 'modal',
      resolve: {
        acceptTermsAndConditions: () => true,

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

        goBack: /* @ngInject */  (goBackToList) => goBackToList,
      },
    });
};
