export default class DialplanEditCtrl {
  /* @ngInject */
  constructor($q, $scope, $translate, TucToast) {
    this.$q = $q;
    this.$scope = $scope;
    this.$translate = $translate;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.dialplanCtrl = null;
    this.ovhPabxCtrl = null;
    this.dialplan = null;
    this.ovhPabx = null;
    this.availableCallerNumberTypes = ['caller', 'alias', 'both'];

    // set parent ctrl to get dialplan to edit
    this.dialplanCtrl = this.$scope.$parent.$ctrl;

    // set ovhPabx controller
    this.ovhPabxCtrl = this.dialplanCtrl.ovhPabxCtrl;

    // set dialplan instance
    this.dialplan = this.dialplanCtrl.dialplan.startEdition();

    // set ovhPabx instance
    this.ovhPabx = this.dialplanCtrl.ovhPabx;
  }

  $onDestroy() {
    if (this.dialplan && !this.dialplanCtrl.isLoading()) {
      this.dialplan.stopEdition(true);
    }
  }

  /**
   *  Called on form submit
   */
  onValidateBtnClick() {
    this.dialplanCtrl.popoverStatus.isOpen = false;

    const savePromise =
      this.dialplan.status !== 'DRAFT'
        ? this.dialplan.save()
        : this.dialplan.create();

    return savePromise
      .then(
        () => {
          this.dialplan.stopEdition();
        },
        (error) => {
          const errorTranslationKey =
            this.dialplan.status !== 'DRAFT'
              ? 'telephony_number_feature_ovh_pabx_dialplan_save_error'
              : 'telephony_number_feature_ovh_pabx_dialplan_create_error';
          this.dialplan.stopEdition(true);
          this.TucToast.error(
            [
              this.$translate.instant(errorTranslationKey),
              error.data && error.data.message,
            ].join(' '),
          );
          return this.$q.reject(error);
        },
      )
      .finally(() => {
        this.dialplanCtrl.loading.save = false;
      });
  }

  /**
   *  Called on cancel button clicked
   */
  onCancelBtnClick() {
    // close popover
    this.dialplanCtrl.popoverStatus.isOpen = false;
    this.dialplanCtrl.popoverStatus.move = false;

    // if draft => remove from ovh pabx dialplans list and refresh current displayed dialplan
    if (this.dialplan.status === 'DRAFT') {
      this.ovhPabx.removeDialplan(this.dialplan);
      this.ovhPabxCtrl.refreshDisplayedDialplan();
    }
  }

  /**
   *  Called on show caller number choice button is clicked
   */
  changeShowCallerNumberChoice() {
    this.dialplanCtrl.popoverStatus.rightPage = 'callerNumber';
    this.dialplanCtrl.popoverStatus.move = true;
  }
}
