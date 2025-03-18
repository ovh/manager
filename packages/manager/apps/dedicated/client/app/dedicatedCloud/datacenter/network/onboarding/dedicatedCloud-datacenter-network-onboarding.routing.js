export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.network.onboarding',
    {
      url: '/onboarding',
      component: 'ovhManagerDedicatedCloudDatacenterNetworkOnboarding',
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
