export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.general-information.upgrade-storage',
    {
      url: '/upgrade-storage',
      component: 'ovhManagerPciProjectDatabaseGeneralInformationUpgradeStorage',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'pci_databases_general_information_upgrade_storage',
          ),
        flavor: /* @ngInject */ (getCurrentFlavor) => getCurrentFlavor(),
        onStorageUpgrade: /* @ngInject */ (goBackAndPoll) => goBackAndPoll,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
