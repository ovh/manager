import get from 'lodash/get';

export default class MigrateOfferCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
  }

  $onInit() {
    this.isLoading = false;
    this.getMigrationInfo();
  }

  getMigrationInfo() {
    return this.cloudConnectService
      .getMigrationAvailable(this.cloudConnect.id)
      .then((data) => {
        this.availableMigration = data;
      });
  }

  static capitalizeFirstLetter(value) {
    return value && value.charAt(0).toUpperCase() + value.substring(1);
  }

  migrateOffer() {
    this.cloudConnectService.trackClick(
      'cloud-connect::overview::migrate-offer::confirm',
    );
    this.isLoading = true;
    this.cloudConnectService
      .migrateService(this.cloudConnect.id)
      .then(() => {
        return this.goBack(
          this.$translate.instant('cloud_connect_migrate_offer_success'),
          'success',
          true,
        );
      })
      .catch((error) =>
        this.goBack(
          this.$translate.instant('cloud_connect_migrate_offer_error', {
            message: get(error, 'data.message', error.message),
          }),
          'error',
        ),
      )
      .finally(() => {
        this.isLoading = false;
      });
  }
}
