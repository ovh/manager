import {
  pricingConstants,
  workflowConstants,
} from '@ovh-ux/manager-product-offers';

import {
  HOSTING_CDN_CHANGE_TYPE,
  HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BUSINESS,
  HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BUSINESS_FREE,
  HOSTING_CDN_ORDER_CDN_VERSION_V1,
  HOSTING_PRODUCT_NAME,
} from './hosting-cdn-order.constant';

export default /* @ngInject */ ($stateProvider) => {
  const resolve = {
    autoPayWithPreferredPaymentMethod: /* @ngInject */ (ovhPaymentMethod) =>
      ovhPaymentMethod.hasDefaultPaymentMethod(),

    availablePlans: /* @ngInject */ (
      availableOptions,
      cdnProperties,
      ovhManagerProductOffersService,
    ) =>
      availableOptions
        .filter(({ family }) => family === 'cdn')
        .sort((planCodeA, planCodeB) => {
          const planCodeAPrice = ovhManagerProductOffersService.constructor.getUniquePricingOfCapacity(
            planCodeA.prices,
            'renew',
          );
          const planCodeBPrice = ovhManagerProductOffersService.constructor.getUniquePricingOfCapacity(
            planCodeB.prices,
            'renew',
          );

          return planCodeAPrice.priceInUcents - planCodeBPrice.priceInUcents;
        })
        .map(({ planCode }) => ({
          planCode,
          available: !planCode.includes(cdnProperties?.type),
          current: planCode.includes(cdnProperties?.type),
        })),

    catalog: /* @ngInject */ (user, WucOrderCartService) =>
      WucOrderCartService.getProductPublicCatalog(
        user.ovhSubsidiary,
        HOSTING_PRODUCT_NAME,
      ),

    goBack: /* @ngInject */ (goToHosting) => goToHosting,

    goBackWithError: /* @ngInject */ ($translate, goBack) => (error) =>
      goBack(
        $translate.instant('hosting_dashboard_cdn_order_error', {
          message: error,
        }),
        'danger',
      ),

    getChangeType: /* @ngInject */ (availablePlans) => (
      oldPlanCode,
      newPlanCode,
    ) => {
      const oldPlanIndex = availablePlans.findIndex(
        (plan) => plan.planCode === oldPlanCode,
      );
      const newPlanIndex = availablePlans.findIndex(
        (plan) => plan.planCode === newPlanCode,
      );

      return oldPlanIndex < newPlanIndex
        ? HOSTING_CDN_CHANGE_TYPE.UPGRADE
        : HOSTING_CDN_CHANGE_TYPE.DOWNGRADE;
    },

    getChangeDetails: /* @ngInject */ (
      cdnProperties,
      getChangeType,
      workflowOptions,
    ) => () => {
      const { type: oldPlanCode } = cdnProperties || {};
      const newPlanCode = workflowOptions.getPlanCode();

      return {
        changeType: getChangeType(oldPlanCode, newPlanCode),
        oldPlanCode,
        newPlanCode,
      };
    },

    serviceName: /* @ngInject */ ($transition$) =>
      $transition$.params().productId,

    serviceInfo: /* @ngInject */ (Hosting, serviceName) =>
      Hosting.getServiceInfos(serviceName),

    cdnProperties: /* @ngInject */ (HostingCdnSharedService, serviceName) => {
      return HostingCdnSharedService.getCDNProperties(serviceName)
        .then(({ data: cdn }) => cdn)
        .catch(() => null);
    },

    hasCDN: /* @ngInject */ (cdnProperties) => cdnProperties !== null,

    isV1CDN: /* @ngInject */ (cdnProperties, hasCDN) =>
      hasCDN && cdnProperties.version === HOSTING_CDN_ORDER_CDN_VERSION_V1,

    isIncludedCDN: /* @ngInject */ (cdnProperties, isV1CDN) =>
      isV1CDN && cdnProperties.free,

    isPayableCDN: /* @ngInject */ (cdnProperties, isV1CDN) =>
      isV1CDN && !cdnProperties.free,

    cdnCase: /* @ngInject */ (isIncludedCDN, isPayableCDN, hasCDN) => {
      if (isIncludedCDN) {
        return 'included';
      }
      if (isPayableCDN) {
        return 'payable';
      }
      if (!hasCDN) {
        return 'without';
      }
      return null;
    },

    onError: /* @ngInject */ (
      atInternet,
      getChangeDetails,
      goBackWithError,
    ) => (error) => {
      const changeDetails = getChangeDetails();
      atInternet.trackPage({
        name: `web_hosting_cdn_order::${changeDetails.changeType}_error::${changeDetails.oldPlanCode}::${changeDetails.newPlanCode}`,
        type: 'navigation',
      });
      return goBackWithError(error.data?.message || error);
    },

    trackClick: /* @ngInject */ (atInternet) => (hit) => {
      atInternet.trackClick({
        name: hit,
        type: 'action',
      });
    },
  };

  const resolveOrder = {
    onSuccess: /* @ngInject */ (
      $translate,
      atInternet,
      getChangeDetails,
      goBack,
    ) => (checkout) => {
      const message = checkout.autoPayWithPreferredPaymentMethod
        ? $translate.instant('hosting_dashboard_cdn_order_success_activation')
        : $translate.instant('hosting_dashboard_cdn_v2_order_success', {
            t0: checkout.url,
          });

      const changeDetails = getChangeDetails();
      atInternet.trackPage({
        name: `web_hosting_cdn_order::${changeDetails.changeType}_validate::${changeDetails.oldPlanCode}::${changeDetails.newPlanCode}`,
        type: 'navigation',
      });
      return goBack(message);
    },

    pricingType: () => pricingConstants.PRICING_CAPACITIES.RENEW,
    workflowType: () => workflowConstants.WORKFLOW_TYPES.ORDER,
    workflowOptions: /* @ngInject */ (
      catalog,
      cdnProperties,
      serviceName,
      trackClick,
    ) => ({
      catalog,
      catalogItemTypeName: workflowConstants.CATALOG_ITEM_TYPE_NAMES.ADDON,
      onPricingSubmit: () => {
        trackClick('web::hosting::cdn::order::next');
      },
      onValidateSubmit() {
        const newPlanCode = this.getPlanCode();

        trackClick('web::hosting::cdn::order::confirm');
        trackClick(`web_hosting_cdn_order::order::${newPlanCode}`);
      },
      productName: HOSTING_PRODUCT_NAME,
      serviceNameToAddProduct: serviceName,
    }),

    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('hosting_cdn_order_breadcrumb'),
  };
  const resolveUpgrade = {
    onSuccess: /* @ngInject */ (
      $translate,
      atInternet,
      getChangeDetails,
      goBack,
    ) => (result) => {
      const message = result.autoPayWithPreferredPaymentMethod
        ? $translate.instant('hosting_dashboard_cdn_upgrade_included_success')
        : $translate.instant('hosting_dashboard_cdn_v2_order_success', {
            t0: result.url,
          });
      const changeDetails = getChangeDetails();
      atInternet.trackPage({
        name: `web_hosting_cdn_order::${changeDetails.changeType}_validate::${changeDetails.oldPlanCode}::${changeDetails.newPlanCode}`,
        type: 'navigation',
      });
      return goBack(message);
    },

    pricingType: () => pricingConstants.PRICING_CAPACITIES.UPGRADE,
    workflowType: () => workflowConstants.WORKFLOW_TYPES.SERVICES,
    workflowOptions: /* @ngInject */ (
      cdnProperties,
      getChangeType,
      ovhManagerProductOffersActionService,
      serviceInfo,
      trackClick,
    ) => {
      let upgradeServiceId;
      return ovhManagerProductOffersActionService
        .getAvailableOptions(serviceInfo.serviceId)
        .then((options) => {
          const cdnOption = options.find(({ billing }) =>
            billing.plan.code.includes('cdn'),
          );

          upgradeServiceId = cdnOption.serviceId;
          return ovhManagerProductOffersActionService.getAvailableUpgradePlancodes(
            upgradeServiceId,
          );
        })
        .then((upgrades) => {
          const cdnUpgrades = upgrades.filter(
            ({ planCode }) =>
              ![
                HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BUSINESS,
                HOSTING_CDN_ORDER_CATALOG_ADDONS_PLAN_CODE_CDN_BUSINESS_FREE,
              ].includes(planCode),
          );
          return {
            plancodes: cdnUpgrades,
            onPricingSubmit: () => {
              trackClick('web::hosting::cdn::order::next');
            },
            onValidateSubmit() {
              const { type: oldPlanCode } = cdnProperties || {};
              const newPlanCode = this.getPlanCode();

              trackClick('web::hosting::cdn::order::confirm');
              trackClick(
                `web_hosting_cdn_order::${getChangeType(
                  oldPlanCode,
                  newPlanCode,
                )}::${oldPlanCode}::${newPlanCode}`,
              );
            },
            serviceId: upgradeServiceId,
          };
        });
    },

    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('hosting_cdn_upgrade_breadcrumb'),
  };
  const atInternet = {
    rename: 'web::hosting::cdn::order',
  };

  $stateProvider.state('app.hosting.dashboard.cdn.order', {
    url: '/order',
    component: 'hostingCdnOrder',
    resolve: { ...resolve, ...resolveOrder },
    atInternet,
  });

  $stateProvider.state('app.hosting.dashboard.cdn.upgrade', {
    url: '/upgrade',
    component: 'hostingCdnOrder',
    resolve: { ...resolve, ...resolveUpgrade },
    atInternet,
  });
};
