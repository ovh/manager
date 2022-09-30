import { TRACKING } from './onboarding.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.cold-archive.onboarding',
    {
      url: '/onboarding',
      component: 'pciProjectStorageColdArchiveOnboarding',
      atInternet: {
        rename: TRACKING.ONBOARDING_PAGE_VISITE,
      },
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('containers')
          .then((containers) =>
            containers.length > 0
              ? {
                  state: 'pci.projects.project.storages.cold-archive.objects',
                }
              : false,
          ),
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
      },
    },
  );
};
