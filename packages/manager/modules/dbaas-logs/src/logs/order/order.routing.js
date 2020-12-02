export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.order', {
    url: '/order',
    views: {
      logsContainer: 'dbaasLogsOrder',
    },
    resolve: {
      catalog: ($http, me) => {
        return $http
          .get('/order/catalog/public/logs', {
            params: {
              ovhSubsidiary: me.ovhSubsidiary,
            },
          })
          .then(({ data }) => data);
      },
      formattedPrice: ($http, me, LogsConstants) => {
        return $http
          .get('/order/catalog/formatted/logs', {
            params: {
              ovhSubsidiary: me.ovhSubsidiary,
            },
          })
          .then((catalog) => {
            const selectedCatalog = catalog.data.plans.find(
              (plan) => plan.planCode === LogsConstants.LDP_PLAN_CODE,
            );

            const selectedFamily = selectedCatalog.addonsFamily.find(
              (addon) => addon.family === LogsConstants.ADD_ON_FAMILY.NEW,
            );

            const indexingCapacities = selectedFamily.addons.find(
              (add) =>
                add.plan.planCode ===
                LogsConstants.CONSUMPTION_REFERENCE.STREAM,
            );
            const indexingFirstStepPrice = indexingCapacities.plan.details.pricings.default.find(
              (capabilities) =>
                capabilities.capacities.includes(
                  LogsConstants.CONSUMPTION_CAPACITY,
                ) &&
                capabilities.maximumQuantity === LogsConstants.INDEXING_TIERING,
            );
            const indexingSecondStepPrice = indexingCapacities.plan.details.pricings.default.find(
              (capabilities) =>
                capabilities.capacities.includes(
                  LogsConstants.CONSUMPTION_CAPACITY,
                ) &&
                capabilities.minimumQuantity ===
                  LogsConstants.INDEXING_TIERING + 1,
            );

            const standardPlanPrice = {
              FirstStep: indexingFirstStepPrice.price.text,
              SecondStep: indexingSecondStepPrice.price.text,
            };

            const planEnterprise = catalog.data.plans.find(
              (plan) =>
                plan.planCode === LogsConstants.LDP_PLAN_CODE_ENTERPRISE,
            );
            const pricingsEnterprise = planEnterprise.details.pricings.default.find(
              (pricing) => pricing.capacities.includes('renew'),
            );
            const installationEntreprise = planEnterprise.details.pricings.default.find(
              (pricing) => pricing.capacities.includes('installation'),
            );
            const enterprisePlanPrice = {
              subscription: pricingsEnterprise.price.text,
              installation: installationEntreprise.price.text,
            };
            return {
              standardPlanPrice,
              enterprisePlanPrice,
            };
          });
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_order'),
    },
  });
};
