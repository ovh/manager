export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.general-information.upgrade-plan',
    {
      url: '/upgrade-plan',
      component: 'ovhManagerPciProjectDatabaseGeneralInformationUpgradePlan',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_general_information_upgrade_plan'),
        currentPlan: /* @ngInject */ (getCurrentPlan) => getCurrentPlan(),
        plans: /* @ngInject */ (database, engine) =>
          engine.getAvailablePlans(database.version, database.region),
        onPlanUpgrade: /* @ngInject */ (goBackAndPoll) => goBackAndPoll,
      },
    },
  );
};
