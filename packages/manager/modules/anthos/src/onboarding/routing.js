import { ANTHOS_READ_MORE_GUIDE, GUIDES } from '../anthos.constants';
import illustration from './assets/anthos.png';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.onboarding', {
    url: '/onboarding',
    component: 'anthosOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('tenants')
        .then((tenants) => {
          return tenants.length > 0
            ? {
                state: 'anthos.index',
              }
            : false;
        }),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('anthos_onboarding_breadcrumb'),

      ovhSubsidiary: /* @ngInject */ (coreConfig) =>
        coreConfig.getUser().ovhSubsidiary,

      illustration: /* @ngInject */ () => illustration,

      guides: /* @ngInject */ ($translate, ovhSubsidiary) => {
        return [
          {
            name: 'documentation',
            title: $translate.instant('anthos_onboarding_guides_anthos_title'),
            description: $translate.instant(
              'anthos_onboarding_guides_anthos_description',
            ),
            link: GUIDES[ovhSubsidiary] || GUIDES.DEFAULT,
            external: true,
          },
        ];
      },

      anthosReadMoreInfoLink: /* @ngInject */ (ovhSubsidiary) =>
        ANTHOS_READ_MORE_GUIDE[ovhSubsidiary] || ANTHOS_READ_MORE_GUIDE.DEFAULT,

      tenants: /* @ngInject */ (AnthosTenantsService) =>
        AnthosTenantsService.getTenants(),

      trackingPrefix: () => {
        return 'hpc::anthos';
      },

      trackClick: /* @ngInject */ (atInternet, trackingPrefix) => (hit) => {
        atInternet.trackClick({
          name: `${trackingPrefix}::${hit}`,
          type: 'action',
        });
      },

      trackPage: /* @ngInject */ (atInternet, trackingPrefix) => (hit) => {
        atInternet.trackPage({
          name: `${trackingPrefix}::${hit}`,
        });
      },
    },
  });
};
