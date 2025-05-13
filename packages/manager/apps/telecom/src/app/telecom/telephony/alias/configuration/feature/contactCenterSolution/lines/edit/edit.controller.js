import isEqual from 'lodash/isEqual';
import remove from 'lodash/remove';

export default class TelecomTelephonyAliasConfigurationLinesEditCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    $uibModalInstance,
    enumStatus,
    lineToEdit,
    tucVoipServiceAlias,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.enumStatus = enumStatus;
    this.lineToEdit = lineToEdit;
    this.tucVoipServiceAlias = tucVoipServiceAlias;
  }

  $onInit() {
    remove(this.enumStatus, { value: 'onBreak' });
    this.loading = false;
    this.selectedStatus = this.enumStatus.find(
      ({ value }) => value === this.lineToEdit.status,
    );
    this.copyLine = angular.copy(this.lineToEdit);
  }

  hasChanged() {
    return !isEqual(this.lineToEdit, this.copyLine);
  }

  updateLine() {
    this.loading = true;
    const { status, simultaneousLines, timeout, wrapUpTime } = this.lineToEdit;

    return this.tucVoipServiceAlias
      .updateContactCenterSolutionNumberAgent(
        {
          billingAccount: this.$stateParams.billingAccount,
          serviceName: this.$stateParams.serviceName,
        },
        this.lineToEdit.agentId,
        {
          status,
          simultaneousLines,
          timeout,
          wrapUpTime,
        },
      )
      .then(() => {
        this.$uibModalInstance.close();
      })
      .catch(() => {
        this.$uibModalInstance.dismiss(
          this.$translate.instant(
            'telephony_alias_config_contactCenterSolution_lines_line_edit_error',
          ),
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
