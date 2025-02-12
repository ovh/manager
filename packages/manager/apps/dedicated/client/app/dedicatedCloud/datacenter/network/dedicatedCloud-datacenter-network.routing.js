import { NSXT_EDGE_PLAN_CODE } from '../../../components/dedicated-cloud/datacenter/network/onboarding/dedicatedCloud-datacenter-network-onboarding.constants';
import { NETWORK_LABEL } from '../dedicatedCloud-datacenter.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.network',
    {
      url: '/network',
      views: {
        pccDatacenterView: {
          component: 'ovhManagerDedicatedCloudDatacenterNetwork',
        },
      },
      redirectTo: (transition) => {
        const getIsNsxtCompatible = transition
          .injector()
          .getAsync('isNsxtCompatible');
        const getHasSubscribedToNsxt = transition
          .injector()
          .getAsync('hasSubscribedToNsxt');

        return Promise.all([getIsNsxtCompatible, getHasSubscribedToNsxt]).then(
          ([isNsxtCompatible, hasSubscribedToNsxt]) => {
            if (!isNsxtCompatible) {
              return {
                state: 'app.dedicatedCloud.details.datacenter.details',
              };
            }
            return !hasSubscribedToNsxt
              ? {
                  state:
                    'app.dedicatedCloud.details.datacenter.details.network.onboarding',
                }
              : false;
          },
        );
      },
      resolve: {
        serviceId: /* @ngInject */ (currentService) =>
          currentService.serviceInfos.serviceId,
        serviceOptions: /* @ngInject */ (serviceId, DedicatedCloud) =>
          DedicatedCloud.getDatacenterOptions(serviceId),
        nsxEdgeOptionServiceId: /* @ngInject */ (serviceOptions) =>
          serviceOptions.find(
            (option) => option.billing.plan.code === NSXT_EDGE_PLAN_CODE,
          ).serviceId,
        hasSubscribedToNsxt: /* @ngInject */ (serviceOptions) =>
          serviceOptions.some(
            (option) => option.billing.plan.code === NSXT_EDGE_PLAN_CODE,
          ),
        breadcrumb: () => NETWORK_LABEL,
      },
    },
  );
};
