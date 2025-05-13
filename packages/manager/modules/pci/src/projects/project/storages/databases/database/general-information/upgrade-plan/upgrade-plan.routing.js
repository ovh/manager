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
        plans: /* @ngInject */ (database, currentPlan, availableEngines) => {
          const availablePlans = [
            ...availableEngines
              .find((engine) => engine.name === database.engine)
              .versions.find((version) => version.version === database.version)
              .plans,
          ];
          if (!availablePlans.find((p) => p.name === currentPlan.name)) {
            availablePlans.push(currentPlan);
          }
          return availablePlans;
        },

        onPlanUpgrade: /* @ngInject */ (goBackAndPoll) => goBackAndPoll,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
