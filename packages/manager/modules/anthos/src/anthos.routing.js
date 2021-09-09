import Tenant from './Tenant.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.index', {
    url: '',
    component: 'anthosTenants',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('tenants')
        .then((tenants) => {
          if (tenants.length === 0) {
            return {
              state: 'anthos.onboarding',
            };
          }
          if (tenants.length === 1) {
            return {
              state: 'anthos.dashboard',
              params: {
                serviceName: tenants[0].serviceName,
              },
            };
          }
          return false;
        }),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('anthos_tenants'),

      user: /* @ngInject */ (coreConfig) => coreConfig.getUser(),

      tenants: /* @ngInject */ ($q, user, AnthosTenantsService) =>
        AnthosTenantsService.getTenants().then((tenantServices) =>
          $q
            .all(
              tenantServices.map((serviceName) => {
                return AnthosTenantsService.getTenantDetails(
                  serviceName,
                ).catch(() => {});
              }),
            )
            .then((tenants) => {
              return tenants
                .filter((tenant) => tenant !== undefined)
                .map((tenant) => new Tenant(tenant, user.ovhSubsidiary));
            }),
        ),

      getServiceNameLink: /* @ngInject */ ($state) => ({ serviceName }) =>
        $state.href('anthos.dashboard', {
          serviceName,
        }),
    },
  });
};
