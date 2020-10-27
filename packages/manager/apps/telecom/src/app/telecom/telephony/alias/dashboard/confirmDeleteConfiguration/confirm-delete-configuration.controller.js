export default class TelecomTelephonyAliasConfirmDeleteConfigurationCtrl {
  /* @ngInject */
  constructor($uibModalInstance, isObsolete, number, tucVoipServiceAlias) {
    this.$uibModalInstance = $uibModalInstance;

    this.isObsolete = isObsolete;
    this.number = number;
    this.tucVoipServiceAlias = tucVoipServiceAlias;
  }

  confirm() {
    const emptyType = 'empty';

    this.loading = true;
    this.tucVoipServiceAlias
      .changeNumberFeatureType(this.number, emptyType)
      .then(() => {
        this.$uibModalInstance.close();
      })
      .catch((error) => {
        this.$uibModalInstance.dismiss(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  cancel() {
    if (!this.loading) {
      this.$uibModalInstance.dismiss();
    }
  }
}
