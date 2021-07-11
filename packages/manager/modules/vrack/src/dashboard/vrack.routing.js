import { FEATURE_NAMES } from './vrack.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack.dashboard', {
    url: '/:vrackId',
    component: 'ovhManagerVrackComponent',
    resolve: {
      goToMoveDialog: /* @ngInject */ ($state) => (service) =>
        $state.go('vrack.move', { service }),
      features: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping.checkFeatureAvailability(
          Object.values(FEATURE_NAMES),
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
