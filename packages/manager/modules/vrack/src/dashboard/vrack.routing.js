import { FEATURE_NAMES } from './vrack.constant';
import { GUIDELINK } from '../vrack.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vrack.dashboard', {
    url: '/:vrackId',
    component: 'ovhManagerVrackComponent',
    resolve: {
      guideLinks: /* @ngInject */ (coreConfig) =>
        GUIDELINK[coreConfig.getUser().ovhSubsidiary] || GUIDELINK.DEFAULT,
      goToMoveDialog: /* @ngInject */ ($state) => (service) =>
        $state.go('vrack.dashboard.move', { service }),
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
    atInternet: {
      ignore: true,
    },
  });
};
