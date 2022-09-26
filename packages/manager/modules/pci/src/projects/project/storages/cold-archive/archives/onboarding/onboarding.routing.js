import { COLD_ARCHIVE_TRACKING_PREFIX } from '../../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.cold-archive.onboarding',
    {
      url: '/onboarding',
      component: 'pciProjectStorageColdArchiveOnboarding',
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
      atInternet: {
        rename: `${COLD_ARCHIVE_TRACKING_PREFIX}::onboarding`,
      },
    },
  );
};
