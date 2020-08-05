angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.packs.pack.migration', {
      url: '/migration',
      views: {
        '@telecom.packs': {
          templateUrl: 'app/telecom/pack/migration/telecom-pack-migration.html',
          controller: 'TelecomPackMigrationCtrl',
          controllerAs: 'PackMigrationCtrl',
        },
        'offersView@telecom.packs.pack.migration': {
          templateUrl:
            'app/telecom/pack/migration/offers/telecom-pack-migration-offers.html',
          controller: 'TelecomPackMigrationOffersCtrl',
          controllerAs: 'OffersCtrl',
          noTranslations: true,
        },
        'confirmView@telecom.packs.pack.migration': {
          templateUrl:
            'app/telecom/pack/migration/confirm/telecom-pack-migration-confirm.html',
          controller: 'TelecomPackMigrationConfirmCtrl',
          controllerAs: 'ConfirmCtrl',
          noTranslations: true,
        },
        'shippingView@telecom.packs.pack.migration': {
          templateUrl:
            'app/telecom/pack/migration/shipping/telecom-pack-migration-shipping.html',
          controller: 'TelecomPackMigrationShippingCtrl',
          controllerAs: 'ShippingCtrl',
          noTranslations: true,
        },
        'migrationView@telecom.packs.pack.migration': {
          templateUrl:
            'app/telecom/pack/migration/migration/telecom-pack-migration-migration.html',
          controller: 'TelecomPackMigrationMigrationCtrl',
          controllerAs: 'MigrationCtrl',
          noTranslations: true,
        },
        'serviceDeleteView@telecom.packs.pack.migration': {
          templateUrl:
            'app/telecom/pack/migration/service-delete/telecom-pack-migration-service-delete.html',
          controller: 'TelecomPackMigrationServiceDeleteCtrl',
          controllerAs: 'ServiceDeleteCtrl',
          noTranslations: true,
        },
        'buildingDetailsView@telecom.packs.pack.migration': {
          templateUrl:
            'app/telecom/pack/migration/building-details/telecom-pack-migration-building-details.html',
          controller: 'TelecomPackMigrationBuildingDetailsCtrl',
          controllerAs: '$ctrl',
          noTranslations: true,
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telecom_pack_migration_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
