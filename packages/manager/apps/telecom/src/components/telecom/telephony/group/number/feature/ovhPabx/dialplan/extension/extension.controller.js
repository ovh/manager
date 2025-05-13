import find from 'lodash/find';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import last from 'lodash/last';
import set from 'lodash/set';
import some from 'lodash/some';
import uniqueId from 'lodash/uniqueId';

export default class DialplanExtensionCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $timeout,
    $translate,
    atInternet,
    autoScrollOnToggle,
    TucToast,
    TUC_UI_SORTABLE_HELPERS,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.autoScrollOnToggle = autoScrollOnToggle;
    this.TucToast = TucToast;
    this.tucUiSortableHelpers = TUC_UI_SORTABLE_HELPERS;
  }

  $onInit() {
    this.redrawInterval = null;

    this.loading = {
      init: false,
    };

    this.popoverStatus = {
      isOpen: false,
      move: false,
    };

    this.displayHelpers = {
      collapsed: true,
      expanded: false,
      negativeCollapsed: true,
      negativeExpanded: false,
    };

    this.ovhPabx = null;
    this.dialplan = null;

    this.rulesSortableOptions = null;
    this.negativeRulesSortableOptions = null;
    this.uuid = null;

    let sortInterval = null;
    let initPromise = this.$q.when(true);
    const sortableOptions = {
      axis: 'y',
      handle: '.rule-grip',
      cancel: '.voip-plan__step-icon--grip-disabled',
      containment: 'parent',
      sort: this.tucUiSortableHelpers.variableHeightTolerance,
      start() {
        sortInterval = setInterval(() => {}, 33);
      },
      stop() {
        if (sortInterval) {
          clearInterval(sortInterval);

          // redraw links for the last time
        }
      },
    };

    this.loading.init = true;

    // set sortable options
    // for non negative rules
    this.rulesSortableOptions = angular.extend(
      {
        update() {
          this.$timeout(() => {
            // update extensions rules positions
            angular.forEach(this.extension.rules, (rule, index) => {
              set(rule, 'position', index + 1);
            });

            // call api to update all positions
            this.extension.updateRulesPositions();
          });
        },
      },
      sortableOptions,
    );

    // for negative rules
    this.negativeRulesSortableOptions = angular.extend(
      {
        update() {
          this.$timeout(() => {
            // update extensions rules positions
            angular.forEach(this.extension.negativeRules, (rule, index) => {
              set(rule, 'position', index + 1);
            });

            // call api to update all positions
            this.extension.updateRulesPositions(null, true);
          });
        },
      },
      sortableOptions,
    );

    this.ovhPabx = this.numberCtrl.number.feature;
    this.dialplan = this.dialplanCtrl.dialplan;
    this.uuid = uniqueId(
      'ovhPabx_diaplan_extension_'.concat(this.extension.extensionId),
    );

    if (!['DRAFT', 'IN_CREATION'].includes(this.extension.status)) {
      initPromise = this.$q.allSettled([
        this.extension.getRules(),
        this.extension.getScreenListConditions(),
        this.extension.getTimeConditions(),
      ]);
    }

    this.$scope.$watch(
      () => this.numberCtrl.reorderingMode,
      (reorder, previousValue) => {
        if (reorder === previousValue) return;
        if (reorder && this.extension.rules?.length) {
          this.displayHelpers.collapsed = false;
        } else {
          this.displayHelpers.collapsed = true;
        }
      },
    );

    this.$scope.$watch(
      () => this.numberCtrl.actionsShowAll,
      (showAll, previousValue) => {
        if (showAll === previousValue) return;
        this.displayHelpers.collapsed = !showAll;
      },
    );

    return initPromise.finally(() => {
      this.loading.init = false;
    });
  }

  isLoading() {
    return (
      this.loading.init ||
      (this.extension &&
        (!['OK', 'DELETE_PENDING'].includes(this.extension.status) ||
          some(
            this.extension.screenListConditions,
            (screenListCondition) =>
              !['CREATING', 'DELETING'].includes(screenListCondition.state),
          ) ||
          some(
            this.extension.timeConditions,
            (timeCondition) =>
              !['CREATING', 'DELETING'].includes(timeCondition.state),
          )))
    );
  }

  getExtensionAttr(attr) {
    return get(
      this.extension.inEdition ? this.extension.saveForEdition : this.extension,
      attr,
    );
  }

  extensionHasConditions() {
    return (
      this.getExtensionAttr('schedulerCategory') ||
      this.getExtensionAttr('screenListType') ||
      this.getExtensionAttr('timeConditions').length
    );
  }

  static getRuleAttr(attr, rule) {
    return get(rule.inEdition ? rule.saveForEdition : rule, attr);
  }

  getRuleMenu(rule) {
    const ruleActionParam = this.getRuleAttr('actionParam', rule);
    if (isNumber(ruleActionParam)) {
      return this.numberCtrl.number.feature.getMenu(ruleActionParam);
    }
    return rule.ivrMenu;
  }

  getRulesCount() {
    return this.extension.rules.length + this.extension.negativeRules.length;
  }

  getEndpointUuid() {
    return this.uuid;
  }

  checkForDisplayHelpers() {
    if (!this.extension.rules.length) {
      this.displayHelpers.collapsed = true;
      this.displayHelpers.expanded = false;
    }
  }

  reorderExtension() {
    this.dialplanCtrl.reorderExtension(this.extension);
  }

  static reorderRule(rule, ruleList) {
    const other = find(ruleList, {
      position: rule.position + 1,
    });
    if (other) {
      const tmp = rule.position;
      set(rule, 'position', other.position);
      other.position = tmp;
      rule.move(rule.position);
      other.move(other.position);
    }
  }

  /* ----------  ACTIVATE/DESACTIVATE  ----------*/

  toggleEnabledState() {
    this.loading.save = true;

    const actionPromise = this.extension.enabled
      ? this.extension.disable()
      : this.extension.enable();

    return actionPromise.finally(() => {
      this.loading.save = false;
      this.atInternet.trackClick({
        name: `ccs::dialplan::step-${this.extension.position}::${
          this.extension.enabled ? '' : 'de'
        }activate-step`,
        type: 'action',
      });
    });
  }

  toggleCollapse() {
    this.displayHelpers.collapsed = !this.displayHelpers.collapsed;
    if (!this.displayHelpers.collapsed) {
      this.atInternet.trackClick({
        name: `ccs::dialplan::step-${this.extension.position}::display-actions`,
        type: 'action',
      });
    }
  }

  /* ----------  ADD RULE  ----------*/

  addRule(isNegative) {
    if (
      last(this.extension.rules)?.status === 'DRAFT' ||
      last(this.extension.negativeRules)?.status === 'DRAFT'
    ) {
      return;
    }
    if (!isNegative) {
      this.displayHelpers.collapsed = false;
      this.displayHelpers.expanded = true;
    } else {
      this.displayHelpers.negativeCollapsed = false;
      this.displayHelpers.negativeExpanded = true;
    }

    this.atInternet.trackClick({
      name: `ccs::dialplan::step-${this.extension.position}::add-action`,
      type: 'action',
    });

    this.extension.addRule({
      position: isNegative
        ? this.extension.negativeRules.length + 1
        : this.extension.rules.length + 1,
      status: 'DRAFT',
      negativeAction: isNegative,
    });
  }

  onCancelExtensionEdit() {
    this.popoverStatus.isOpen = false;
    this.popoverStatus.move = false;
    this.extension.stopEdition(true);
  }

  /* ----------  MANAGE CONDITIONS  ----------*/

  onManageConditionBtnClick() {
    this.popoverStatus.isOpen = true;
    this.atInternet.trackClick({
      name: `ccs::dialplan::step-${this.extension.position}::advanced-configuration`,
      type: 'action',
    });
  }

  /* ----------  DELETE  ----------*/

  /**
   *  Call API to delete extension
   */
  onConfirmDeleteBtnClick() {
    return this.extension
      .remove()
      .then(
        () => {
          // remove extension from list
          this.dialplan.removeExtension(this.extension);

          // check for other extensions that position needs to be updated
          // this.extension is not destroyed yet so use it to determine
          // which extensions needs to update their positions
          this.dialplan.updateExtensionsPositions(this.extension.position);

          // display information about extension count
          this.dialplanCtrl.checkForDisplayHelpers();
          this.atInternet.trackClick({
            name: `ccs::dialplan::step-${this.extension.position}::delete-step`,
            type: 'action',
          });
        },
        (error) => {
          this.TucToast.error(
            [
              this.$translate.instant(
                'telephony_number_feature_ovh_pabx_step_remove_error',
              ),
              (error.data && error.data.message) || '',
            ].join(' '),
          );
          return this.$q.reject(error);
        },
      )
      .finally(() => {
        this.loading.save = false;
      });
  }

  /* ----------  COLLAPSE  ---------- */

  onExtensionCollapsed(isNegative) {
    set(
      this.displayHelpers,
      isNegative ? 'negativeExpanded' : 'expanded',
      false,
    );
  }

  onExtensionExpanding(isNegative) {
    set(
      this.displayHelpers,
      isNegative ? 'negativeExpanded' : 'expanded',
      true,
    );
  }

  onExtensionExpanded() {
    const elt = angular.element(
      `#group-number__action-id-${this.extension.extensionId}`,
    )[0];
    if (elt) {
      elt.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }
}
