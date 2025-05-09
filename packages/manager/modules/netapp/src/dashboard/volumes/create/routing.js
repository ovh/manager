import {
  VOLUME_TRACKING_PREFIX,
  VOLUME_TRACKING_CONTEXT,
} from '../../constants';

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
      trackClick: /* @ngInject */ (atInternet) => (tracker) =>
        atInternet.trackClick({
          name: `${VOLUME_TRACKING_PREFIX}button::add_volume::${tracker}`,
          ...VOLUME_TRACKING_CONTEXT,
          type: 'action',
          page_category: 'popup',
          page: {
            name: `${VOLUME_TRACKING_PREFIX}netapp::popup::add::volume`,
          },
        }),
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
      protocolEnum: /* @ngInject */ (schema) =>
        schema.models['storage.ProtocolEnum'].enum,
      schema: /* @ngInject */ ($http) =>
        $http.get('/storage.json').then(({ data }) => data),
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
    onEnter: /* @ngInject */ (atInternet) => {
      atInternet.trackPage({
        name: `${VOLUME_TRACKING_PREFIX}netapp::popup::add::volume`,
        ...VOLUME_TRACKING_CONTEXT,
        page_category: 'popup',
      });
    },
  });
};
