angular.module('managerApp').controller('telephonyNumberOvhPabxDialplanExtensionRuleCtrl', function ($q, $translate, TelephonyMediator, TucToast) {
  const self = this;

  self.popoverStatus = {
    isOpen: false,
    move: false,
    rightPage: null,
  };

  self.ovhPabx = null;
  self.dialplan = null;
  self.extension = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function refreshSubwayPlan() {
    self.extensionCtrl.extension.removeRule(self.rule);
  }

  self.isLoading = function () {
    return ['SAVING', 'CREATING', 'DELETING', 'MOVING'].indexOf(self.rule.status) > -1;
  };

  self.getActionFamily = function () {
    return self.rule.getActionFamily(self.rule.inEdition
      ? self.rule.saveForEdition.action : self.rule.action);
  };

  self.getRuleAttribute = function (attr) {
    return _.get(self.rule.inEdition ? self.rule.saveForEdition : self.rule, attr);
  };

  self.getVoicemailInfos = function () {
    return TelephonyMediator.findService(self.getRuleAttribute('actionParam'));
  };

  self.getMenu = function () {
    return self.rule.ivrMenu || self.ovhPabx.getMenu(self.getRuleAttribute('actionParam'));
  };

  self.getRealRulePosition = function () {
    return _.indexOf(self.rule.negativeAction
      ? self.extension.negativeRules : self.extension.rules, self.rule) + 1;
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  self.onDeleteButtonClick = function () {
    self.rule.status = 'DELETE_CONFIRM';
  };

  self.onConfirmDeleteButtonClick = function () {
    if (self.rule.status === 'DRAFT') {
      // should not append
      return refreshSubwayPlan();
    }
    self.deletePending = false;
    return self.rule.remove().then(() => {
      refreshSubwayPlan();
      self.extensionCtrl.extension
        .updateRulesPositions(self.rule.position, self.rule.negativeAction);

      // display information about rule count
      self.extensionCtrl.checkForDisplayHelpers();
    }, (error) => {
      TucToast.error([$translate.instant('telephony_number_feature_ovh_pabx_step_rule_action_delete_error'), _.get(error, 'data.message') || ''].join(' '));
      return $q.reject(error);
    });
  };

  self.onRuleOutsideClick = function () {
    if (!self.deletePending) {
      return;
    }

    // cancel delete confirm
    self.deletePending = false;
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function () {
    // check if popover needs to be opened
    self.popoverStatus.isOpen = self.rule.status === 'DRAFT';

    // set ovh pabx instance
    self.ovhPabx = self.numberCtrl.number.feature;

    // set dialplan
    self.dialplan = self.dialplanCtrl.dialplan;

    // set extension
    self.extension = self.extensionCtrl.extension;
  };

  /* -----  End of INITIALIZATION  ------*/
});
