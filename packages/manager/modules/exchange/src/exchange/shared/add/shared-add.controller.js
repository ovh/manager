angular.module('Module.exchange.controllers').controller(
  'ExchangeAddPublicFolderCtrl',
  class ExchangeAddPublicFolderCtrl {
    constructor(
      $scope,
      Exchange,
      ExchangePublicFolders,
      $window,
      messaging,
      $translate,
      navigation,
    ) {
      this.services = {
        $scope,
        Exchange,
        ExchangePublicFolders,
        $window,
        messaging,
        $translate,
        navigation,
      };

      this.$routerParams = Exchange.getParams();

      this.folderToAdd = {};
      this.errors = {
        folderIsValid: false,
        pathIsValid: true,
        pathIsAvailable: true,
        quotaIsValid: true,
      };

      $scope.isThereAnyValidationError = () => this.isThereAnyValidationError();
      $scope.retrievingPublicFolderOptions = () => this.retrievingPublicFolderOptions();
      $scope.submitting = () => this.submitting();
    }

    retrievingPublicFolderOptions() {
      this.services.messaging.resetMessages();
      this.loading = true;

      return this.services.ExchangePublicFolders.retrievingPublicFolderOptions(
        this.$routerParams.organization,
        this.$routerParams.productId,
      )
        .then((data) => {
          this.publicFoldersOptions = data;

          this.quotaUnitTranslation = this.services.$translate.instant(
            `unit_size_${data.maxQuota.unit}`,
          );
          this.folderToAdd.type = _.first(data.types);
          this.folderToAdd.defaultPermission = _.first(data.defaultPermissions);
          this.folderToAdd.anonymousPermission = _.first(data.anonymousPermissions);
          this.folderToAdd.quota = Math.min(100, data.maxQuota.value);

          if (data.maxQuota.value === 0) {
            this.services.messaging.writeError(
              this.services.$translate.instant('exchange_tab_SHARED_max_quota_error_message'),
            );
            this.services.navigation.resetAction();
          }
        })
        .catch((failure) => {
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_tab_SHARED_all_error_message'),
            failure,
          );
          this.services.navigation.resetAction();
        })
        .finally(() => {
          this.loading = false;
        });
    }

    checkFolderValidity() {
      this.fixPath();
      this.checkInvalidCharactersInPath();
      this.checkPathIsNotReserved();
      this.checkQuotaValidity();
    }

    checkFolderPathExists() {
      this.errors.folderIsValid = true;

      if (!_.has(this.folderToAdd, 'path') || _.isEmpty(this.folderToAdd.path)) {
        this.errors.folderIsValid = false;
      }
    }

    fixPath() {
      this.checkFolderPathExists();

      if (!this.errors.folderIsValid) {
        return;
      }

      const pathStartsWithBackslash = _(this.folderToAdd.path).startsWith('\\');
      if (!pathStartsWithBackslash) {
        this.folderToAdd.path = `\\${this.folderToAdd.path}`;
      }
    }

    checkInvalidCharactersInPath() {
      this.checkFolderPathExists();

      if (!this.errors.folderIsValid) {
        return;
      }

      this.errors.pathIsValid = true;
      const invalidCharacters = /[;%/'"?]/; // ; % / ' " ?
      const pathContainsInvalidCharacters = invalidCharacters.test(this.folderToAdd.path);
      const pathEndsWithBackslash = _(this.folderToAdd.path).endsWith('\\');

      if (pathContainsInvalidCharacters || pathEndsWithBackslash) {
        this.errors.pathIsValid = false;
        this.errors.folderIsValid = false;
      }
    }

    checkPathIsNotReserved() {
      this.checkFolderPathExists();

      if (!this.errors.folderIsValid) {
        return;
      }

      this.errors.pathIsReserved = true;

      if (
        _.has(this.publicFoldersOptions, 'reservedPaths')
        && _(this.publicFoldersOptions.reservedPaths).includes(this.folderToAdd.path)
      ) {
        this.errors.pathIsAvailable = false;
        this.errors.folderIsValid = false;
      }
    }

    checkQuotaValidity() {
      this.errors.quotaIsValid = true;
      const quotaIsWithinLimits = this.folderToAdd.quota >= this.publicFoldersOptions.minQuota.value
        && this.folderToAdd.quota <= this.publicFoldersOptions.maxQuota.value;

      if (!_.isNumber(this.folderToAdd.quota) || !quotaIsWithinLimits) {
        this.errors.quotaIsValid = false;
        this.errors.folderIsValid = false;
      }
    }

    isThereAnyValidationError() {
      return !_(this.errors)
        .values()
        .includes(false);
    }

    submitting() {
      this.services.messaging.writeSuccess(
        this.services.$translate.instant('exchange_dashboard_action_doing'),
      );

      return this.services.ExchangePublicFolders.addingPublicFolder(
        this.$routerParams.organization,
        this.$routerParams.productId,
        this.folderToAdd,
      )
        .then((success) => {
          this.services.messaging.writeSuccess(
            this.services.$translate.instant('exchange_action_SHARED_add_success_message'),
            success,
          );
        })
        .catch((failure) => {
          this.services.messaging.writeError(
            this.services.$translate.instant('exchange_action_SHARED_add_fail_message'),
            failure,
          );
        })
        .finally(() => {
          this.services.navigation.resetAction();
        });
    }
  },
);
