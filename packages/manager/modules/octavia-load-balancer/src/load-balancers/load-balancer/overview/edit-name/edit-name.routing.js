import { TRACKING_NAME, TRACKING_CHAPTER_1 } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.general-information.edit-name',
    {
      url: '/edit-name',
      views: {
        modal: {
          component: 'octaviaLoadBalancerEditName',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go(
            'octavia-load-balancer.loadbalancer.general-information',
            {},
            reload ? { reload: 'octavia-load-balancer.loadbalancer' } : null,
          ),
        trackingSuffix: () => `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::rename`,
        trackCancel: /* @ngInject */ (atInternet, trackingSuffix) => () => {
          atInternet.trackClick({
            name: `${trackingSuffix}::cancel`,
            type: 'action',
          });
        },
        trackConfirm: /* @ngInject */ (atInternet, trackingSuffix) => () => {
          atInternet.trackClick({
            name: `${trackingSuffix}::confirm`,
            type: 'action',
          });
        },
        trackSuccess: /* @ngInject */ (atInternet, trackingSuffix) => () => {
          atInternet.trackClick({
            name: `${trackingSuffix}-success`,
            type: 'action',
          });
        },
        trackFailure: /* @ngInject */ (atInternet, trackingSuffix) => () => {
          atInternet.trackClick({
            name: `${trackingSuffix}-error`,
            type: 'action',
          });
        },
      },
      atInternet: {
        rename: `${TRACKING_NAME}::rename`,
      },
    },
  );
};
