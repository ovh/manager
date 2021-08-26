import clone from 'lodash/clone';

export default class PrivateDatabaseBDDsExtensionCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $stateParams,
    $translate,
    Alerter,
    databaseName,
    PrivateDatabase,
    PrivateDatabaseExtension,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.alerter = Alerter;
    this.databaseName = databaseName;
    this.privateDatabaseService = PrivateDatabase;
    this.privateDatabaseExtensionService = PrivateDatabaseExtension;
  }

  $onInit() {
    this.productId = this.$stateParams.productId;
    this.privateDatabaseService.restartPoll(this.$stateParams.serviceName, [
      'whitelist/create',
      'whitelist/delete',
    ]);

    this.getExtensions();
  }

  getExtensions() {
    this.extensions = null;
    this.privateDatabaseExtensionService
      .getExtensions(this.productId, this.databaseName)
      .then((extensions) => {
        this.extensions = extensions
          .sort()
          .map((id) => ({ id, extensionName: id }));
      })
      .catch((err) => {
        this.alerter.error(
          this.$translate.instant(
            'privateDatabase_tabs_list_extensions_retrieve_infos',
          ),
          err,
        );
      });
  }

  toggleExtension(opts) {
    const extension = clone(opts);

    if (!extension.updating && extension.transformed) {
      let action;
      extension.updating = true;
      if (extension.enabled) {
        action = this.enableExtension(extension).then(() =>
          this.alerter.success(
            this.$translate.instant(
              'privateDatabase_tabs_list_extensions_enable_success',
            ),
            this.$scope.alerts.main,
          ),
        );
      } else {
        action = this.disableExtension(extension).then(() =>
          this.alerter.success(
            this.$translate.instant(
              'privateDatabase_tabs_list_extensions_disable_success',
            ),
            this.$scope.alerts.main,
          ),
        );
      }
      action
        .catch((error) => {
          let errorMessage = this.$translate.instant(
            'privateDatabase_tabs_list_extensions_enable_error',
          );
          if (error.data) {
            errorMessage = `${errorMessage} ${error.data.message}`;
          }
          this.alerter.error(errorMessage, this.$scope.alerts.main);

          extension.enabled = !extension.enabled;
        })
        .finally(() => {
          delete extension.updating;
        });
    }
  }

  enableExtension(extension) {
    return this.privateDatabaseExtensionService.enableExtension(
      this.productId,
      this.databaseName,
      extension.extensionName,
    );
  }

  disableExtension(extension) {
    return this.privateDatabaseExtensionService.disableExtension(
      this.productId,
      this.databaseName,
      extension.extensionName,
    );
  }

  transformItem(item, force) {
    if (item.transformed && !force) {
      return this.$q((resolve) => resolve(item));
    }
    return this.privateDatabaseExtensionService
      .getExtension(this.productId, this.databaseName, item.id)
      .then((originalExtension) => {
        const extension = clone(originalExtension);

        extension.id = item.id;
        extension.enabled = extension.status === 'enabled';
        extension.transformed = true;
        return extension;
      })
      .catch((err) => {
        this.alerter.error(
          this.$translate.instant(
            'privateDatabase_tabs_list_extensions_retrieve_infos',
          ),
          err,
        );
      });
  }
}
