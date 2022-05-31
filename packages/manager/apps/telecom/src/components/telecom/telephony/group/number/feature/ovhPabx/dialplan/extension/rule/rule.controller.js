import get from 'lodash/get';
import indexOf from 'lodash/indexOf';

export default class DialplanExtensionRuleCtrl {
  /* @ngInject */
  constructor(
    $state,
    $q,
    $translate,
    atInternet,
    autoScrollOnToggle,
    TelephonyMediator,
    TucToast,
  ) {
    this.$state = $state;
    this.$q = $q;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.autoScrollOnToggle = autoScrollOnToggle;
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
    this.voicemailInfos = null;
    this.isLoadingVoicemailInfos = false;
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

  fetchVoicemailInfos() {
    if (this.isLoadingVoicemailInfos) {
      return;
    }
    this.isLoadingVoicemailInfos = true;
    this.TelephonyMediator.findService(this.getRuleAttribute('actionParam'))
      .then((service) => {
        this.voicemailInfos = service;
      })
      .finally(() => {
        this.isLoadingVoicemailInfos = false;
      });
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

  openPopOver() {
    this.popoverStatus.isOpen = true;
    this.atInternet.trackClick({
      name: `ccs::dialplan::actions-step-${this.extension.position}::modify-action`,
      type: 'action',
    });
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
        this.atInternet.trackClick({
          name: `ccs::dialplan::actions-step-${this.extension.position}::delete-action`,
          type: 'action',
        });
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

  onCancelRuleEdit() {
    this.popoverStatus.isOpen = false;
    this.popoverStatus.move = false;

    if (this.rule.status === 'DRAFT') {
      this.extensionCtrl.extension.removeRule(this.rule);

      // check for collapsing or not the rules into extension component view
      this.extensionCtrl.checkForDisplayHelpers();
    }
  }

  isTerminalAction() {
    const action = this.rule.inEdition
      ? this.rule.saveForEdition.action
      : this.rule.action;
    switch (action) {
      case 'hangup':
      case 'endless_playback':
      case 'voicemail':
      case 'bridge':
        return true;
      default:
        return false;
    }
  }

  onModifyInteractiveMenu() {
    this.$state.go(
      'telecom.telephony.billingAccount.alias.details.configuration.ovhPabx.menus',
      { defaultMenuId: this.getMenu().menuId },
    );
  }
}
