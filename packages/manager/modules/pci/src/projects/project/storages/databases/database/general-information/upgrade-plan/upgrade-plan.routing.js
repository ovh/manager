export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.general-information.upgrade-plan',
    {
      url: '/upgrade-plan',
      component: 'ovhManagerPciProjectDatabaseGeneralInformationUpgradePlan',
      resolve: {
        breadcrumb: () => null,
        currentPlan: /* @ngInject */ (getCurrentPlan) => getCurrentPlan(),
        plans: /* @ngInject */ (database, engine) =>
          engine.getAvailablePlans(database.version, database.region),
        onPlanUpgrade: /* @ngInject */ (goBackAndPoll) => goBackAndPoll,
      },
    },
  );
};
