angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.migration', {
    url: '/migration',
    views: {
      'packView@telecom.pack': {
        templateUrl: 'app/telecom/pack/migration/telecom-pack-migration.html',
        controller: 'TelecomPackMigrationCtrl',
        controllerAs: 'PackMigrationCtrl',
      },
      'offersView@telecom.pack.migration': {
        templateUrl: 'app/telecom/pack/migration/offers/telecom-pack-migration-offers.html',
        controller: 'TelecomPackMigrationOffersCtrl',
        controllerAs: 'OffersCtrl',
        noTranslations: true,
      },
      'confirmView@telecom.pack.migration': {
        templateUrl: 'app/telecom/pack/migration/confirm/telecom-pack-migration-confirm.html',
        controller: 'TelecomPackMigrationConfirmCtrl',
        controllerAs: 'ConfirmCtrl',
        noTranslations: true,
      },
      'shippingView@telecom.pack.migration': {
        templateUrl: 'app/telecom/pack/migration/shipping/telecom-pack-migration-shipping.html',
        controller: 'TelecomPackMigrationShippingCtrl',
        controllerAs: 'ShippingCtrl',
        noTranslations: true,
      },
      'migrationView@telecom.pack.migration': {
        templateUrl: 'app/telecom/pack/migration/migration/telecom-pack-migration-migration.html',
        controller: 'TelecomPackMigrationMigrationCtrl',
        controllerAs: 'MigrationCtrl',
        noTranslations: true,
      },
      'serviceDeleteView@telecom.pack.migration': {
        templateUrl: 'app/telecom/pack/migration/service-delete/telecom-pack-migration-service-delete.html',
        controller: 'TelecomPackMigrationServiceDeleteCtrl',
        controllerAs: 'ServiceDeleteCtrl',
        noTranslations: true,
      },
      'buildingDetailsView@telecom.pack.migration': {
        templateUrl: 'app/telecom/pack/migration/building-details/telecom-pack-migration-building-details.html',
        controller: 'TelecomPackMigrationBuildingDetailsCtrl',
        controllerAs: '$ctrl',
        noTranslations: true,
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
