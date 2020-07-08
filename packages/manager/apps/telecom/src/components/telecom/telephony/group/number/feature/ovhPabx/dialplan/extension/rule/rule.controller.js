import get from 'lodash/get';
import indexOf from 'lodash/indexOf';

export default class DialplanExtensionRuleCtrl {
  /* @ngInject */
  constructor($q, $translate, TelephonyMediator, TucToast) {
    this.$q = $q;
    this.$translate = $translate;
    this.TelephonyMediator = TelephonyMediator;
    this.TucToast = TucToast;

    this.popoverStatus = {
      isOpen: false,
      move: false,
      rightPage: null,
    };

    this.ovhPabx = null;
    this.dialplan = null;
    this.extension = null;
  }

  $onInit() {
    // check if popover needs to be opened
    this.popoverStatus.isOpen = this.rule.status === 'DRAFT';

    // set ovh pabx instance
    this.ovhPabx = this.numberCtrl.number.feature;

    // set dialplan
    this.dialplan = this.dialplanCtrl.dialplan;

    // set extension
    this.extension = this.extensionCtrl.extension;
  }

  refreshSubwayPlan() {
    this.extensionCtrl.extension.removeRule(this.rule);
  }

  isLoading() {
    return (
      ['SAVING', 'CREATING', 'DELETING', 'MOVING'].indexOf(this.rule.status) >
      -1
    );
  }

  getActionFamily() {
    return this.rule.getActionFamily(
      this.rule.inEdition ? this.rule.saveForEdition.action : this.rule.action,
    );
  }

  getRuleAttribute(attr) {
    return get(
      this.rule.inEdition ? this.rule.saveForEdition : this.rule,
      attr,
    );
  }

  getVoicemailInfos() {
    return this.TelephonyMediator.findService(
      this.getRuleAttribute('actionParam'),
    );
  }

  getMenu() {
    return (
      this.rule.ivrMenu ||
      this.ovhPabx.getMenu(this.getRuleAttribute('actionParam'))
    );
  }

  getRealRulePosition() {
    return (
      indexOf(
        this.rule.negativeAction
          ? this.extension.negativeRules
          : this.extension.rules,
        this.rule,
      ) + 1
    );
  }

  onDeleteButtonClick() {
    this.rule.status = 'DELETE_CONFIRM';
  }

  onConfirmDeleteButtonClick() {
    if (this.rule.status === 'DRAFT') {
      // should not append
      return this.refreshSubwayPlan();
    }
    this.deletePending = false;
    return this.rule.remove().then(
      () => {
        this.refreshSubwayPlan();
        this.extensionCtrl.extension.updateRulesPositions(
          this.rule.position,
          this.rule.negativeAction,
        );

        // display information about rule count
        this.extensionCtrl.checkForDisplayHelpers();
      },
      (error) => {
        this.TucToast.error(
          [
            this.$translate.instant(
              'telephony_number_feature_ovh_pabx_step_rule_action_delete_error',
            ),
            get(error, 'data.message') || '',
          ].join(' '),
        );
        return this.$q.reject(error);
      },
    );
  }

  onRuleOutsideClick() {
    if (!this.deletePending) {
      return;
    }

    // cancel delete confirm
    this.deletePending = false;
  }
}
