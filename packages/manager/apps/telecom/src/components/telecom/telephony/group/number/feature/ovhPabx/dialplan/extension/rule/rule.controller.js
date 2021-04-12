import get from 'lodash/get';
import indexOf from 'lodash/indexOf';

export default class DialplanExtensionRuleCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $timeout,
    $translate,
    autoScrollOnToggle,
    TelephonyMediator,
    TucToast,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
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

    // There is a display bug whith popover misplacement probably due to the
    // poor css used in this section. I didn't manage to find a clean fix
    // and i'm using this dirty fix for now until a better solution is provided.
    // Triggering a focus event on the popup make uib bootstrap popover recompute
    // his position.
    // @TODO find a better way to clean popover misplacement
    this.$scope.$watch(
      () => this.popoverStatus.move,
      (move) => {
        if (move) {
          [1, 10, 50, 100, 250, 500, 1000].map((delay) =>
            this.$timeout(() => {
              angular
                .element('.popover-page')
                .last()
                .focus();
            }, delay),
          );
        }
      },
    );
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

  openPopOver() {
    this.popoverStatus.isOpen = true;
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

  onCancelRuleEdit() {
    this.popoverStatus.isOpen = false;
    this.popoverStatus.move = false;

    if (this.rule.status === 'DRAFT') {
      this.extensionCtrl.extension.removeRule(this.rule);

      // check for collapsing or not the rules into extension component view
      this.extensionCtrl.checkForDisplayHelpers();
    }
  }
}
