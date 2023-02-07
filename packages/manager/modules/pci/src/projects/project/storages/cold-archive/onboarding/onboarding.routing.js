import {
  COLD_ARCHIVE_TRACKING,
  COLD_ARCHIVE_STATES,
} from '../cold-archives.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(COLD_ARCHIVE_STATES.ONBOARDING, {
    url: '/onboarding',
    views: {
      'coldArchiveView@pci.projects.project.storages.cold-archive': {
        component: 'pciProjectStorageColdArchiveOnboarding',
      },
    },
    atInternet: {
      rename: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${COLD_ARCHIVE_TRACKING.ONBOARDING.MAIN}`,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('containers')
        .then((containers) =>
          containers.length > 0
            ? {
                state: COLD_ARCHIVE_STATES.CONTAINERS,
              }
            : false,
        ),
    resolve: {
      breadcrumb: () => null, // Hide breadcrumb
    },
  });
};
