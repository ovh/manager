import { ANTHOS_TENANT_ALERTER } from '../anthos.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard', {
    url: '/:serviceName',
    component: 'anthosDashboard',
    resolve: {
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,

      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,

      tenant: /* @ngInject */ (serviceName, AnthosTenantsService) => {
        return AnthosTenantsService.getTenantDetails(serviceName);
      },

      hosts: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getHosts(serviceName).then(({ data }) => data),

      netappStorage: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getTenantStorageUsage(serviceName),

      // TODO:: remove the catch snippet code once API fixed issue with get
      publicIPs: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getTenantPublicIPs(serviceName).catch(() => []),

      // TODO:: remove the catch snippet code once API fixed issue with get
      privateIPs: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getTenantPrivateIPs(serviceName).catch(() => []),

      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),

      dashboardLink: /* @ngInject */ ($state, serviceName) =>
        $state.href('anthos.dashboard', { serviceName }),

      generalInformationLink: /* @ngInject */ ($state, serviceName) =>
        $state.href('anthos.dashboard.general-information', {
          serviceName,
        }),

      hostLink: /* @ngInject */ ($state, serviceName) =>
        $state.href('anthos.dashboard.host', { serviceName }),

      storageLink: /* @ngInject */ ($state, serviceName) =>
        $state.href('anthos.dashboard.storage', { serviceName }),

      serviceInfo: /* @ngInject */ (serviceName, AnthosTenantsService) =>
        AnthosTenantsService.getServiceInfo(serviceName),

      goToTenant: ($state, tenant, displayAlerterMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = 'anthos.dashboard';

        const promise = $state.go(state, {
          reload,
        });

        if (message) {
          promise.then(() => displayAlerterMessage(type, message));
        }

        return promise;
      },

      displayAlerterMessage: /* @ngInject */ (Alerter) => (type, message) =>
        Alerter[type](message, ANTHOS_TENANT_ALERTER),

      goToOrderHost: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.general-information.order-host'),

      goToOrderPublicIPs: /* @ngInject */ ($state) => () =>
        $state.go('anthos.dashboard.general-information.order-public-ips'),

      reloadState: /* @ngInject */ ($state) => () => {
        $state.go($state.current, {}, { reload: true });
      },
    },
    redirectTo: 'anthos.dashboard.general-information',
  });
};
