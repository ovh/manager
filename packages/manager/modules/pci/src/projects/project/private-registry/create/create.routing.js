import map from 'lodash/map';
import find from 'lodash/find';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.private-registry.create', {
    url: '/create',
    component: 'pciProjectPrivateRegistryCreate',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate('private_registry_create'),

      capabilities: /* @ngInject */ (pciPrivateRegistryService, projectId) =>
        pciPrivateRegistryService.getCapabilities(projectId),
      acceptTermsAndConditions: () => true,
      availableRegions: /* @ngInject */ (capabilities) =>
        map(capabilities, (capability) => ({
          name: capability.regionName,
          hasEnoughQuota: () => true,
        })),

      registryContracts: /* @ngInject */ ($q, pciPrivateRegistryService) =>
        pciPrivateRegistryService.getAgreements().then((agreements) => {
          const agreementPromises = map(agreements || [], (agreement) =>
            pciPrivateRegistryService
              .getContractInfo(agreement.id)
              .then((contract) =>
                Object.assign(contract, {
                  id: agreement.id,
                  validated: agreement.validated,
                }),
              ),
          );
          return $q.all(agreementPromises);
        }),
      plans: /* @ngInject */ (capabilities) => (regionName) => {
        const { plans } = find(capabilities, { regionName });
        return map(plans, (plan) => ({
          ...plan,
          // Waiting for API to provide ...
          planCode: `registry.${plan.name
            .substring(0, 1)
            .toLowerCase()}-plan-equivalent.hour.monthly.postpaid`,
        }));
      },
      goBack: /* @ngInject */ (goBackToList) => goBackToList,
    },
  });
};
