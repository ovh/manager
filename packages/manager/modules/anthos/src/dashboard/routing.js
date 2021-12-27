import { ANTHOS_TENANT_ALERTER } from '../anthos.constants';
import { TRACKING_PREFIX } from './constants';
import Tenant from '../Tenant.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard', {
    url: '/:serviceName',
    component: 'anthosDashboard',
    resolve: {
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,

      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,

      alertId: () => 'anthos_dashboard',

      tenant: /* @ngInject */ (serviceName, AnthosTenantsService) => {
        return AnthosTenantsService.getTenantDetails(serviceName).then(
          (tenant) => new Tenant(tenant),
        );
      },

      hosts: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getHosts(serviceName).then(({ data }) => data),

      publicIPs: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getTenantPublicIPs(serviceName),

      privateIPs: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getTenantPrivateIPs(serviceName),

      goToState: ($state, Alerter) => (
        state,
        stateParams = {},
        message = false,
        type = 'done',
      ) => {
        const reload = message && type === 'done';

        const promise = $state.go(
          state,
          {
            ...stateParams,
          },
          { reload },
        );

        if (message) {
          promise.then(() =>
            Alerter.alertFromSWS(message, type, ANTHOS_TENANT_ALERTER),
          );
        }

        return promise;
      },

      isGeneralInformationTabActive: /* @ngInject */ ($state) => () =>
        $state.includes('anthos.dashboard.general-information'),

      isHostTabActive: /* @ngInject */ ($state) => () =>
        $state.includes('anthos.dashboard.host'),

      isStorageTabActive: /* @ngInject */ ($state) => () =>
        $state.includes('anthos.dashboard.storage'),

      isIpsTabActive: /* @ngInject */ ($state) => () =>
        $state.includes('anthos.dashboard.ips'),

      dashboardLink: /* @ngInject */ ($state, serviceName) =>
        $state.href('anthos.dashboard', { serviceName }),

      generalInformationLink: /* @ngInject */ ($state, serviceName) =>
        $state.href('anthos.dashboard.general-information', {
          serviceName,
        }),

      hostLink: /* @ngInject */ ($state, serviceName) =>
        $state.href('anthos.dashboard.host', { serviceName }),

      isHostLinkActive: /* @ngInject */ ($state) => () =>
        $state.includes('anthos.dashboard.host'),

      storageLink: /* @ngInject */ ($state, serviceName) =>
        $state.href('anthos.dashboard.storage', { serviceName }),

      ipsLink: /* @ngInject */ ($state, serviceName) =>
        $state.href('anthos.dashboard.ips', { serviceName }),

      serviceInfo: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getServiceInfo(serviceName),

      goToTenant: ($state, tenant, displayAlerterMessage) => (
        message = false,
        type = 'success',
        stateToGo = 'anthos.dashboard',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(stateToGo, {
          reload,
        });

        if (message) {
          promise.then(() => displayAlerterMessage(type, message));
        }

        return promise;
      },

      goToOrderHost: /* @ngInject */ ($state, serviceName) => () =>
        $state.go('anthos.dashboard.host.order', { serviceName }),

      goBack: /* @ngInject */ ($state, goToTenant) => (message, type) =>
        goToTenant(message, type, $state.$current.parent.name),

      displayAlerterMessage: /* @ngInject */ (Alerter) => (type, message) =>
        Alerter[type](message, ANTHOS_TENANT_ALERTER),

      reloadState: /* @ngInject */ ($state) => () => {
        $state.go($state.current, {}, { reload: true });
      },

      storageUsage: /* @ngInject */ (AnthosTenantsService, serviceName) =>
        AnthosTenantsService.getTenantStorageUsage(serviceName)
          .then((usageData) => ({
            ...usageData,
            totalUsed: usageData.reservedSize + usageData.usedSize,
          }))
          .catch((error) => {
            if (error.status !== 404) {
              throw error;
            } else {
              return null;
            }
          }),

      trackingPrefix: () => {
        return TRACKING_PREFIX;
      },

      trackClick: /* @ngInject */ (atInternet, trackingPrefix) => (hit) => {
        atInternet.trackClick({
          name: `${trackingPrefix}::${hit}`,
          type: 'action',
        });
      },

      trackPage: /* @ngInject */ (atInternet, trackingPrefix) => (hit) => {
        atInternet.trackPage({
          name: `${trackingPrefix}::${hit}`,
        });
      },
    },
    redirectTo: 'anthos.dashboard.general-information',
  });
};
