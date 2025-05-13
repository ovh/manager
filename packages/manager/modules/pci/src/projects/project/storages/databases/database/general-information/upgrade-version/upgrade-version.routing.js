export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.general-information.upgrade-version',
    {
      url: '/upgrade-version',
      views: {
        modal: {
          component:
            'ovhManagerPciProjectDatabaseGeneralInformationUpgradeVersion',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        versions: /* @ngInject */ (database, engine) => {
          const currentVersion = engine.getVersion(database.version);
          return engine.versions.filter(
            (version) => currentVersion.compare(version) > 0,
          );
        },
        onVersionUpgrade: /* @ngInject */ (goBackAndPoll) => goBackAndPoll,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
