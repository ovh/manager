export default /* @ngInject */ function telephonyNumberOvhPabxDialplanEditCtrl(
  $q,
  $scope,
  $translate,
  TucToast,
) {
  const self = this;

  self.dialplanCtrl = null;
  self.ovhPabxCtrl = null;
  self.dialplan = null;
  self.ovhPabx = null;
  self.availableCallerNumberTypes = ['caller', 'alias', 'both'];

  /*= =============================
    =            EVENTS            =
    ============================== */

  /**
   *  Called on form submit
   */
  self.onValidateBtnClick = function onValidateBtnClick() {
    self.dialplanCtrl.popoverStatus.isOpen = false;

    const savePromise =
      self.dialplan.status !== 'DRAFT'
        ? self.dialplan.save()
        : self.dialplan.create();

    return savePromise
      .then(
        () => {
          self.dialplan.stopEdition();
        },
        (error) => {
          const errorTranslationKey =
            self.dialplan.status !== 'DRAFT'
              ? 'telephony_number_feature_ovh_pabx_dialplan_save_error'
              : 'telephony_number_feature_ovh_pabx_dialplan_create_error';
          self.dialplan.stopEdition(true);
          TucToast.error(
            [
              $translate.instant(errorTranslationKey),
              error.data && error.data.message,
            ].join(' '),
          );
          return $q.reject(error);
        },
      )
      .finally(() => {
        self.dialplanCtrl.loading.save = false;
      });
  };

  /**
   *  Called on cancel button clicked
   */
  self.onCancelBtnClick = function onCancelBtnClick() {
    // close popover
    self.dialplanCtrl.popoverStatus.isOpen = false;
    self.dialplanCtrl.popoverStatus.move = false;

    // if draft => remove from ovh pabx dialplans list and refresh current displayed dialplan
    if (self.dialplan.status === 'DRAFT') {
      self.ovhPabx.removeDialplan(self.dialplan);
      self.ovhPabxCtrl.refreshDisplayedDialplan();
    }
  };

  /* ----------  SHOW CALLER NUMBER  ----------*/

  /**
   *  Called on show caller number choice button is clicked
   */
  self.changeShowCallerNumberChoice = function changeShowCallerNumberChoice() {
    self.dialplanCtrl.popoverStatus.rightPage = 'callerNumber';
    self.dialplanCtrl.popoverStatus.move = true;
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /**
   *  Component init
   */
  self.$onInit = function $onInit() {
    // set parent ctrl to get dialplan to edit
    self.dialplanCtrl = $scope.$parent.$ctrl;

    // set ovhPabx controller
    self.ovhPabxCtrl = self.dialplanCtrl.ovhPabxCtrl;

    // set dialplan instance
    self.dialplan = self.dialplanCtrl.dialplan.startEdition();

    // set ovhPabx instance
    self.ovhPabx = self.dialplanCtrl.ovhPabx;
  };

  /**
   *  Component destroy
   */
  self.$onDestroy = function $onDestroy() {
    if (self.dialplan && !self.dialplanCtrl.isLoading()) {
      self.dialplan.stopEdition(true);
    }
  };

  /* -----  End of INITIALIZATION  ------*/
}
