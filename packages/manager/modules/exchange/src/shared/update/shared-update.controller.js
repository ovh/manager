import angular from 'angular';
import isNumber from 'lodash/isNumber';
import includes from 'lodash/includes';
import values from 'lodash/values';

export default class ExchangeUpdatePublicFolderCtrl {
  /* @ngInject */
  constructor(
    $scope,
    wucExchange,
    ExchangePublicFolders,
    messaging,
    navigation,
    $translate,
  ) {
    this.services = {
      $scope,
      wucExchange,
      ExchangePublicFolders,
      messaging,
      navigation,
      $translate,
    };

    this.$routerParams = wucExchange.getParams();
    this.buffer = angular.copy(navigation.currentActionData);
    this.folderToUpdate = navigation.currentActionData;
    this.folderIsValid = false;

    this.errors = {
      quotaIsValid: true,
      permissionsAreValid: true,
    };

    $scope.submitting = () => this.submitting();
    $scope.allOptionsAreValid = () => this.allOptionsAreValid();
    $scope.loadingPublicFolderOptions = () => this.loadingPublicFolderOptions();
  }

  loadingPublicFolderOptions() {
    this.services.messaging.resetMessages();
    this.loading = true;

    return this.services.ExchangePublicFolders.retrievingPublicFolderOptions(
      this.$routerParams.organization,
      this.$routerParams.productId,
    )
      .then((data) => {
        this.publicFoldersOptions = data;
        this.quotaUnitTranslation = this.services.$translate.instant(
          `unit_size_${this.publicFoldersOptions.maxQuota.unit}`,
        );
        // eslint-disable-next-line operator-assignment
        this.publicFoldersOptions.maxQuota.value =
          this.publicFoldersOptions.maxQuota.value +
          this.folderToUpdate.quota.value;
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_tab_SHARED_all_error_message',
          ),
          failure,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  allOptionsAreValid() {
    return !includes(values(this.errors), false);
  }

  checkQuotaValidity() {
    this.errors.quotaIsValid = true;
    const quotaIsWithinLimits =
      this.folderToUpdate.quota.value >=
        this.publicFoldersOptions.minQuota.value &&
      this.folderToUpdate.quota.value <=
        this.publicFoldersOptions.maxQuota.value;

    if (!isNumber(this.folderToUpdate.quota.value) || !quotaIsWithinLimits) {
      this.errors.quotaIsValid = false;
    }
  }

  checkPermissions() {
    this.errors.permissionsAreValid =
      this.folderToUpdate.defaultPermission != null &&
      this.folderToUpdate.anonymousPermission != null;
  }

  submitting() {
    this.services.messaging.writeSuccess(
      this.services.$translate.instant('exchange_dashboard_action_doing'),
    );
    this.folderToUpdate.quota = this.folderToUpdate.quota.value;

    return this.services.ExchangePublicFolders.updatingPublicFolder(
      this.$routerParams.organization,
      this.$routerParams.productId,
      this.folderToUpdate,
    )
      .then((success) => {
        this.services.messaging.writeSuccess(
          this.services.$translate.instant(
            'exchange_action_SHARED_update_success_message',
          ),
          success,
        );
      })
      .catch((failure) => {
        this.services.messaging.writeError(
          this.services.$translate.instant(
            'exchange_action_SHARED_update_fail_message',
          ),
          failure,
        );
      })
      .finally(() => {
        this.services.navigation.resetAction();
      });
  }
}
