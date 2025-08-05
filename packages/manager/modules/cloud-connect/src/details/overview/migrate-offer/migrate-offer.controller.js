import get from 'lodash/get';

export default class MigrateOfferCtrl {
  /* @ngInject */
  constructor($translate, cloudConnectService, User) {
    this.$translate = $translate;
    this.cloudConnectService = cloudConnectService;
    this.User = User;
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
        this.getProductLabel();
      });
  }

  getProductLabel() {
    return this.User.getUser().then(({ ovhSubsidiary }) => {
      return this.cloudConnectService
        .getCatalogProducts(ovhSubsidiary)
        .then((data) => {
          const filteredProduct = data.products.filter(
            (product) => product.name === this.availableMigration.productName,
          );
          this.productName = filteredProduct?.[0]?.description;
        });
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
      .then(() =>
        this.goBack(
          this.$translate.instant('cloud_connect_migrate_offer_success'),
          'success',
          true,
        ),
      )
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
