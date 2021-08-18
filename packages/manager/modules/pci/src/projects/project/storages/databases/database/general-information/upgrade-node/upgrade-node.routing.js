export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.general-information.upgrade-node',
    {
      url: '/upgrade-node',
      views: {
        modal: {
          component:
            'ovhManagerPciProjectDatabaseGeneralInformationUpgradeNode',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        versions: /* @ngInject */ (database, engine) => {
          const currentVersion = engine.getVersion(database.flavor);
          return engine.flavors.filter(
            (flavor) => currentVersion.compare(flavor) > 0,
          );
        },
        onVersionUpgrade: /* @ngInject */ (goBackAndPoll) => goBackAndPoll,
      },
    },
  );
};
