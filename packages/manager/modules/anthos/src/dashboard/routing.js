import { ANTHOS_TENANT_ALERTER } from '../anthos.constants';
import { TRACKING_PREFIX } from './constants';
import Tenant from '../Tenant.class';

const anthosDashboardState = 'anthos.dashboard';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(anthosDashboardState, {
    url: '/:serviceName',
    component: 'anthosDashboard',
    params: {
      patchTenantStatus: {
        value: '',
        dynamic: true,
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,

      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,

      patchTenantStatus: /* @ngInject */ ($transition$) =>
        $transition$.params().patchTenantStatus,

      alertId: () => 'anthos_dashboard',

      tenant: /* @ngInject */ (
        serviceName,
        patchTenantStatus,
        AnthosTenantsService,
      ) =>
        AnthosTenantsService.getTenantDetails(serviceName).then(
          (data) =>
            new Tenant({
              ...data,
              status: patchTenantStatus || data.status,
            }),
        ),

      hosts: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getHosts(serviceName).then(({ data }) => data),

      publicIPs: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getTenantPublicIPs(serviceName),

      privateIPs: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getTenantPrivateIPs(serviceName),

      availableVersions: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getAvailableVersions(serviceName),

      availableOptions: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getAnthosServiceOption(serviceName),

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
        $state.includes(`${anthosDashboardState}.general-information`),

      isHostTabActive: /* @ngInject */ ($state) => () =>
        $state.includes(`${anthosDashboardState}.host`),

      isStorageTabActive: /* @ngInject */ ($state) => () =>
        $state.includes(`${anthosDashboardState}.storage`),

      isIpsTabActive: /* @ngInject */ ($state) => () =>
        $state.includes(`${anthosDashboardState}.ips`),

      isAccessRestrictionTabActive: /* @ngInject */ ($state) => () =>
        $state.includes(`${anthosDashboardState}.access-restriction`),

      dashboardLink: /* @ngInject */ ($state, serviceName) =>
        $state.href(anthosDashboardState, { serviceName }),

      generalInformationLink: /* @ngInject */ ($state, serviceName) =>
        $state.href(`${anthosDashboardState}.general-information`, {
          serviceName,
        }),

      hostLink: /* @ngInject */ ($state, serviceName) =>
        $state.href(`${anthosDashboardState}.host`, { serviceName }),

      isHostLinkActive: /* @ngInject */ ($state) => () =>
        $state.includes(`${anthosDashboardState}.host`),

      storageLink: /* @ngInject */ ($state, serviceName) =>
        $state.href(`${anthosDashboardState}.storage`, { serviceName }),

      ipsLink: /* @ngInject */ ($state, serviceName) =>
        $state.href(`${anthosDashboardState}.ips`, { serviceName }),

      accessRestrictionLink: /* @ngInject */ ($state, serviceName) =>
        $state.href(`${anthosDashboardState}.access-restriction`, {
          serviceName,
        }),

      serviceInfo: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getServiceInfo(serviceName),

      goToTenant: ($state, displayAlerterMessage) => (
        message = false,
        type = 'success',
        stateToGo = anthosDashboardState,
        stateParams = {},
      ) => {
        const options = { reload: message && type === 'success' };
        const promise = $state.go(stateToGo, stateParams, options);

        if (message) {
          promise.then(() => {
            displayAlerterMessage(type, message);
            $state.go($state.current, {
              ...stateParams,
              patchTenantStatus: '',
            });
          });
        }

        return promise;
      },

      goToOrderHost: /* @ngInject */ ($state, serviceName) => () =>
        $state.go(`${anthosDashboardState}.host.order`, { serviceName }),

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
    redirectTo: `${anthosDashboardState}.general-information`,
  });
};
