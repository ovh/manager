import { TRUSTED_ZONE_CALLBACK_PHONE_PAGES } from './onboarding.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.onboarding', {
    url: '/onboarding',
    component: 'pciProjectsOnboarding',
    redirectTo: (transition) =>
      transition
        .injector()
        .get('publicCloud')
        .getDefaultProject()
        .then((projectId) =>
          projectId
            ? {
                state: 'pci.projects.project',
                params: {
                  projectId,
                },
              }
            : null,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb

      openTrustedZoneCallbackPage: /* @ngInject */ (
        $window,
        coreConfig,
      ) => () => {
        const {
          [coreConfig.getUser().ovhSubsidiary]: url,
          DEFAULT,
        } = TRUSTED_ZONE_CALLBACK_PHONE_PAGES;

        return $window.open(url || DEFAULT, '_blank');
      },
    },
  });
};
