const activationType = /* @ngInject */ $transition$ => $transition$.params().activationType;

const resolveCurrentService = /* @ngInject */ (
  $transition$,
  DedicatedCloud,
) => DedicatedCloud.getSelected($transition$.params().productId, true);

const hasDefaultMeansOfPayment = /* @ngInject */ ovhPaymentMethod => ovhPaymentMethod
  .hasDefaultPaymentMethod();

const header = /* @ngInject */ (
  $transition$,
  $translate,
) => $translate.instant(`dedicatedCloudDashboardTilesOptionsOrderSelection_${$transition$.params().activationType}_header`);

const resolveHostFamilies = /* @ngInject */ (
  currentService,
  ovhManagerPccServicePackService,
) => ovhManagerPccServicePackService.fetchHostFamilies(currentService.name);

const resolveOrderableServicePacks = /* @ngInject */ (
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

const resolveServicePacks = /* @ngInject */ (
  $transition$,
  currentService,
  currentUser,
  ovhManagerPccServicePackService,
) => $transition$.params().servicePacks
    || ovhManagerPccServicePackService
      .buildAllForService(currentService.serviceName, currentUser.ovhSubsidiary);

const servicePacksWithPrices = /* @ngInject */ (
  currentUser,
  ovhManagerPccServicePackService,
  hostFamilies,
  servicePacks,
) => ovhManagerPccServicePackService
  .fetchPrices(currentUser.ovhSubsidiary, hostFamilies, servicePacks);

const subheader = /* @ngInject */ (
  $transition$,
  $translate,
) => $translate.instant(`dedicatedCloudDashboardTilesOptionsOrderSelection_${$transition$.params().activationType}_subheader`);

export default {
  params: {
    orderableServicePacks: null,
  },
  resolve: {
    activationType,
    currentService: resolveCurrentService,
    hasDefaultMeansOfPayment,
    header,
    hostFamilies: resolveHostFamilies,
    orderableServicePacks: resolveOrderableServicePacks,
    servicePacks: resolveServicePacks,
    servicePacksWithPrices,
    subheader,
  },
  translations: { value: ['.'], format: 'json' },
};
