import { FEATURE_NAMES, DELETE_VRACK_SERVICE_FEATURE } from './vrack.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack.dashboard', {
    url: '/:vrackId',
    component: 'ovhManagerVrackComponent',
    resolve: {
      goToMoveDialog: /* @ngInject */ ($state) => (service) =>
        $state.go('vrack.dashboard.move', { service }),
      features: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping.checkFeatureAvailability(
          Object.values(FEATURE_NAMES),
        ),
      deletefeature: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(DELETE_VRACK_SERVICE_FEATURE)
          .then((featureAvailability) =>
            featureAvailability.isFeatureAvailable(
              DELETE_VRACK_SERVICE_FEATURE,
            ),
          ),
      vrackId: /* @ngInject */ ($transition$) => $transition$.params().vrackId,
      breadcrumb: /* @ngInject */ (vrackId) => vrackId,
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
  });
};
