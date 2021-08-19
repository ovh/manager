export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.general-information.upgrade-node',
    {
      url: '/upgrade-node',
      component: 'ovhManagerPciProjectDatabaseGeneralInformationUpgradeNode',
      resolve: {
        breadcrumb: () => null,
        currentFlavor: /* @ngInject */ (getCurrentFlavor) => getCurrentFlavor(),
        flavors: /* @ngInject */ (database, engine) =>
          engine.getRegion(database.version, database.plan, database.region)
            .flavors,
        onNodeUpgrade: /* @ngInject */ (goBackAndPoll) => goBackAndPoll,
      },
    },
  );
};
