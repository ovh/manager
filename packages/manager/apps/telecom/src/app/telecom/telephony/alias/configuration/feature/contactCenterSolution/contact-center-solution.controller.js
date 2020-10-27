import get from 'lodash/get';

import deleteConfigurationTemplate from '../../../dashboard/confirmDeleteConfiguration/confirm-delete-configuration.html';
import deleteConfigurationController from '../../../dashboard/confirmDeleteConfiguration/confirm-delete-configuration.controller';

export default class TelecomTelephonyAliasConfigurationContactCenterSolutionCtrl {
  /* @ngInject */
  constructor($state, $translate, $uibModal, alias, OvhApiTelephony, TucToast) {
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
        template: deleteConfigurationTemplate,
        controller: deleteConfigurationController,
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
        this.$state.go('telecom.telephony.billingAccount.alias').then(() => {
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
}
