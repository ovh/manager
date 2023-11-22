export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.network', {
    url: '/network',
    views: {
      'netappContainer@netapp': 'ovhManagerNetAppNetworkConfiguration',
    },
    // component: 'ovhManagerNetAppNetworkConfiguration',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_network_configuration_title'),
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      vrackServices: /* @ngInject */ (NetappNetworkConfigurationService) =>
        NetappNetworkConfigurationService.getVrackServices().then(({ data }) =>
          data.map((vs) => {
            const name = vs.currentState.displayName || vs.id;
            return {
              ...vs,
              display: {
                name,
                nameWithVrackId: vs.currentState.vrackId
                  ? `${name} (${vs.currentState.vrackId})`
                  : name,
              },
            };
          }),
        ),
    },
  });
};
