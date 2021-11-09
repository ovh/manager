const hitName = 'netapp::detail::volumes::volume::create';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.create', {
    url: '/create',
    views: {
      modal: {
        component: 'ovhManagerNetAppCreateVolume',
      },
    },
    layout: 'modal',
    resolve: {
      goToVolumeDetails: /* @ngInject */ ($state, $translate, Alerter) => (
        volumeId,
        successMessage,
      ) =>
        $state
          .go(
            'netapp.dashboard.volumes.dashboard',
            {
              volumeId,
            },
            {
              reload: true,
            },
          )
          .then(() => {
            Alerter.success(successMessage);
          }),
      goBack: /* @ngInject */ (goToVolumes, trackClick) => {
        trackClick('create::cancel');
        return goToVolumes;
      },
      protocolEnum: /* @ngInject */ (schema) =>
        schema.models['storage.ProtocolEnum'].enum,
      schema: /* @ngInject */ ($http) =>
        $http.get('/storage.json').then(({ data }) => data),
      breadcrumb: () => null,
    },
    atInternet: {
      rename: hitName,
    },
  });
};
