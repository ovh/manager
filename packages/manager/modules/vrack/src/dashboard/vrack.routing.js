import { FEATURE_NAMES } from './vrack.constant';
import {
  GUIDELINK,
  VRACK_SERVICE_TYPE,
  VRACK_TRACKING_CONTEXT,
  VRACK_TRACKING_PREFIX,
} from '../vrack.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('vrack.dashboard', {
      url: '/:vrackId',
      component: 'ovhManagerVrackComponent',
      resolve: {
        guideLinks: /* @ngInject */ (coreConfig) =>
          GUIDELINK[coreConfig.getUser().ovhSubsidiary] || GUIDELINK.DEFAULT,
        goToMoveDialog: /* @ngInject */ ($state) => (service) =>
          $state.go('vrack.dashboard.move', { service }),
        goToTerminate: /* @ngInject */ ($state, atInternet) => (service) => {
          atInternet.trackClick({
            name: `${VRACK_TRACKING_PREFIX}page::button::delete_vrack-private-network`,
            type: 'action',
            ...VRACK_TRACKING_CONTEXT,
            page: {
              name: `${VRACK_TRACKING_PREFIX}vrack-private-network::detail`,
            },
            page_category: 'detail',
          });
          return $state.go('vrack.dashboard.terminate', { service });
        },
        features: /* @ngInject */ (ovhFeatureFlipping) =>
          ovhFeatureFlipping.checkFeatureAvailability(
            Object.values(FEATURE_NAMES),
          ),
        vrackId: /* @ngInject */ ($transition$) =>
          $transition$.params().vrackId,
        breadcrumb: /* @ngInject */ (vrackId) => vrackId,
      },
      translations: {
        value: ['.'],
        format: 'json',
      },
      atInternet: {
        ignore: true,
      },
    })
    .state('vrack.dashboard.terminate', {
      url: '/terminate',
      views: {
        modal: {
          component: 'billingAutorenewTerminateAgoraService',
        },
      },
      layout: 'modal',
      resolve: {
        serviceType: () => VRACK_SERVICE_TYPE,
        serviceName: /* @ngInject */ (vrackId) => vrackId,
        serviceInfos: /* @ngInject */ (vrackId, $http) =>
          $http.get(`/vrack/${vrackId}/serviceInfos`).then(({ data }) => data),
        id: /* @ngInject */ (serviceInfos) => serviceInfos.serviceId,
        goBack: /* @ngInject */ ($state, Alerter, CucCloudMessage, vrackId) => (
          message,
          type,
        ) => {
          if (message && type === 'success') {
            return $state.go('vrack.index', { vrackId }).then(() => {
              Alerter.set(`alert-${type}`, message, null, 'InfoErrors');
            });
          }

          return $state.go('vrack.dashboard', { vrackId }).then(() => {
            CucCloudMessage.error(message);
          });
        },
        breadcrumb: () => null,
      },
      atInternet: {
        ignore: true,
      },
    });
};
