import Tenant from './Tenant.class';
import { getAnthosOrderUrl } from './anthos-order';

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
      hideBreadcrumb: () => true,

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

      getServiceNameLink: /* @ngInject */ ($state) => ({ id }) =>
        $state.href('anthos.dashboard', {
          serviceName: id,
        }),

      gotoOrder: /* @ngInject */ ($window, coreConfig) => () => {
        $window.open(
          getAnthosOrderUrl(coreConfig.getUser().ovhSubsidiary),
          '_blank',
        );
      },
    },
    atInternet: {
      rename: 'hpc::anthos::projects',
    },
  });
};
