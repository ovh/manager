import get from 'lodash/get';

angular.module('managerApp').controller(
  'TelecomTelephonyAliasConfigurationContactCenterSolutionCtrl',
  class TelecomTelephonyAliasConfigurationContactCenterSolutionCtrl {
    constructor(
      $state,
      $translate,
      $uibModal,
      alias,
      OvhApiTelephony,
      TucToast,
    ) {
      this.$state = $state;
      this.$translate = $translate;
      this.$uibModal = $uibModal;
      this.alias = alias;
      this.OvhApiTelephony = OvhApiTelephony;
      this.TucToast = TucToast;
    }

    deleteConfiguration() {
      this.$uibModal
        .open({
          templateUrl:
            'app/telecom/telephony/alias/dashboard/confirmDeleteConfiguration/confirmDeleteConfiguration.modal.html',
          controller: 'TelecomTelephonyAliasConfirmDeleteConfigurationCtrl',
          controllerAs: '$ctrl',
          backdrop: 'static',
          resolve: {
            number: this.alias,
            isObsolete: false,
          },
        })
        .result.then(() => {
          this.OvhApiTelephony.Service()
            .v6()
            .resetCache();
          this.$state
            .go('telecom.telephony.billingAccount.alias.details')
            .then(() => {
              this.$state.reload();
            });
        })
        .catch((error) => {
          if (error) {
            this.TucToast.error(
              `${this.$translate.instant('telephony_alias_delete_ko')} ${get(
                error,
                'data.message',
                error.message,
              )}`,
            );
          }
        });
    }
  },
);
