import { TRACKING_DISPLAY_ONBOARDING_NSX_EDGES_SUFFIX } from '../constants';
import { TRACKING_PREFIX_DATACENTER } from '../../dedicatedCloud-datacenter.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.network.onboarding',
    {
      url: '/onboarding',
      component: 'ovhManagerDedicatedCloudDatacenterNetworkOnboarding',
      atInternet: {
        rename: `${TRACKING_PREFIX_DATACENTER}${TRACKING_DISPLAY_ONBOARDING_NSX_EDGES_SUFFIX}`,
      },
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('hasSubscribedToNsxt')
          .then((hasSubscribedToNsxt) =>
            hasSubscribedToNsxt
              ? {
                  state:
                    'app.dedicatedCloud.details.datacenter.details.network',
                }
              : false,
          ),
      resolve: {
        breadcrumb: () => null,
        displaySuccessMessage: /* @ngInject */ (Alerter) => (message) => {
          Alerter.success(message, 'dedicatedCloud_dashboard_alert');
        },
      },
    },
  );
};
