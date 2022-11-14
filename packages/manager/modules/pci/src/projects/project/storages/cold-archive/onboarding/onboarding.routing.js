import { TRACKING } from './onboarding.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.cold-archive.onboarding',
    {
      url: '/onboarding',
      views: {
        'coldArchiveView@pci.projects.project.storages.cold-archive': {
          component: 'pciProjectStorageColdArchiveOnboarding',
        },
      },
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
                  state:
                    'pci.projects.project.storages.cold-archive.containers',
                }
              : false,
          ),
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
      },
    },
  );
};
