export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.cold-archive.containers',
    {
      url: '',
      component: 'pciProjectStorageColdArchiveContainers',
      redirectTo: (transition) =>
        transition
          .injector()
          .getAsync('containers')
          .then((containers) =>
            containers.length === 0
              ? {
                  state:
                    'pci.projects.project.storages.cold-archive.onboarding',
                }
              : false,
          ),
      resolve: {
        breadcrumb: () => null,

        refreshContainers: /* @ngInject */ ($state) => () => $state.reload(),

        // [TODO] : To be implemented in the use case MANAGER-9330.
        goToAddUserContainer: /* @ngInject */ () => () => {},
        archiveContainer: /* @ngInject */ () => () => {},
        restoreContainer: /* @ngInject */ () => () => {},
        deleteContainer: /* @ngInject */ () => () => {},
      },
    },
  );
};
