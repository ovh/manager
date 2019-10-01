const orderableServicePacks = /* @ngInject */ (
  $transition$,
  currentService,
  currentUser,
  ovhManagerPccServicePackService,
) => $transition$.params().orderableServicePacks
    || ovhManagerPccServicePackService
      .fetchOrderable({
        activationType: $transition$.params().activationType,
        currentServicePackName: currentService.servicePackName,
        serviceName: currentService.serviceName,
        subsidiary: currentUser.ovhSubsidiary,
      });

const servicePacks = /* @ngInject */ (
  $transition$,
  currentService,
  currentUser,
  ovhManagerPccServicePackService,
) => $transition$.params().servicePacks
    || ovhManagerPccServicePackService
      .buildAllForService(currentService.serviceName, currentUser.ovhSubsidiary);

const componentName = 'dedicatedCloudServicePack';

export default {
  params: {
    orderableServicePacks: null,
    servicePacks: null,
  },
  resolve: {
    orderableServicePacks,
    servicePacks,
  },
  translations: { value: ['.'], format: 'json' },
  url: '/servicePack?activationType&goToConfiguration',
  views: {
    pccView: componentName,
  },
};
