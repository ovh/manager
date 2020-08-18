import component from './selection.component';

const resolveActivationType = /* @ngInject */ ($transition$) =>
  $transition$.params().activationType;

const resolveCurrentService = /* @ngInject */ ($transition$, DedicatedCloud) =>
  DedicatedCloud.getSelected($transition$.params().productId, true);

const resolveHasDefaultMeansOfPayment = /* @ngInject */ (
  $transition$,
  ovhPaymentMethod,
) =>
  $transition$.params().hasDefaultMeansOfPayment ||
  ovhPaymentMethod.hasDefaultPaymentMethod();

const resolveHosts = /* @ngInject */ (
  currentService,
  ovhManagerPccServicePackService,
) => ovhManagerPccServicePackService.getHosts(currentService.name);

const resolveServicePacks = /* @ngInject */ (
  $transition$,
  currentService,
  currentUser,
  ovhManagerPccServicePackService,
) =>
  $transition$.params().servicePacks ||
  ovhManagerPccServicePackService.getServicePacks(
    currentService.serviceName,
    currentUser.ovhSubsidiary,
  );

const resolveServicePacksWithPrices = /* @ngInject */ (
  currentUser,
  ovhManagerPccServicePackService,
  hosts,
  servicePacks,
) =>
  ovhManagerPccServicePackService.getPrices(
    currentUser.ovhSubsidiary,
    hosts,
    servicePacks,
  );

const resolveServicePackToOrder = /* @ngInject */ ($transition$) =>
  $transition$.params().servicePackToOrder;

const resolveSubHeader = /* @ngInject */ ($transition$, $translate) =>
  $translate.instant(
    `dedicatedCloudDashboardTilesOptionsOrderSelection_${
      $transition$.params().activationType
    }_option`,
  );

export default {
  component: component.name,
  params: {
    hasDefaultMeansOfPayment: null,
    orderableServicePacks: null,
    servicePackToOrder: null,
  },
  resolve: {
    activationType: resolveActivationType,
    currentService: resolveCurrentService,
    hasDefaultMeansOfPayment: resolveHasDefaultMeansOfPayment,
    hosts: resolveHosts,
    servicePacks: resolveServicePacks,
    servicePacksWithPrices: resolveServicePacksWithPrices,
    servicePackToOrder: resolveServicePackToOrder,
    subHeader: resolveSubHeader,
  },
  translations: { value: ['.'], format: 'json' },
};
