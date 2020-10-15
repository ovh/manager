import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import set from 'lodash/set';
import some from 'lodash/some';
import uniqueId from 'lodash/uniqueId';

export default /* @ngInject */ function telephonyNumberOvhPabxDialplanExtensionCtrl(
  $q,
  $scope,
  $timeout,
  $translate,
  TucToast,
  TUC_UI_SORTABLE_HELPERS,
) {
  const self = this;
  let redrawInterval = null;

  self.loading = {
    init: false,
  };

  self.popoverStatus = {
    isOpen: false,
    move: false,
  };

  self.displayHelpers = {
    collapsed: true,
    expanded: false,
    negativeCollapsed: true,
    negativeExpanded: false,
  };

  self.ovhPabx = null;
  self.dialplan = null;

  self.rulesSortableOptions = null;
  self.negativeRulesSortableOptions = null;
  self.uuid = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.isLoading = function isLoading() {
    return (
      self.loading.init ||
      (self.extension &&
        (['OK', 'DELETE_PENDING'].indexOf(self.extension.status) === -1 ||
          some(
            self.extension.screenListConditions,
            (screenListCondition) =>
              ['CREATING', 'DELETING'].indexOf(screenListCondition.state) !==
              -1,
          ) ||
          some(
            self.extension.timeConditions,
            (timeCondition) =>
              ['CREATING', 'DELETING'].indexOf(timeCondition.state) !== -1,
          )))
    );
  };

  self.startRedraw = function startRedraw() {
    if (!redrawInterval) {
      redrawInterval = setInterval(() => {
        self.numberCtrl.jsplumbInstance.customRepaint();
      }, 33);
    }
  };

  self.stopRedraw = function stopRedraw() {
    if (redrawInterval) {
      clearInterval(redrawInterval);
      redrawInterval = null;

      // redraw links for the last time
      self.numberCtrl.jsplumbInstance.customRepaint();
    }
  };

  self.getExtensionAttr = function getExtensionAttr(attr) {
    return get(
      self.extension.inEdition ? self.extension.saveForEdition : self.extension,
      attr,
    );
  };

  self.extensionHasConditions = function extensionHasConditions() {
    return (
      self.getExtensionAttr('schedulerCategory') ||
      self.getExtensionAttr('screenListType') ||
      self.getExtensionAttr('timeConditions').length
    );
  };

  self.getRuleAttr = function getRuleAttr(attr, rule) {
    return get(rule.inEdition ? rule.saveForEdition : rule, attr);
  };

  self.getRuleMenu = function getRuleMenu(rule) {
    const ruleActionParam = self.getRuleAttr('actionParam', rule);
    if (isNumber(ruleActionParam)) {
      return self.numberCtrl.number.feature.getMenu(ruleActionParam);
    }
    return rule.ivrMenu;
  };

  self.getRulesCount = function getRulesCount() {
    return self.extension.rules.length + self.extension.negativeRules.length;
  };

  self.getEndpointUuid = function getEndpointUuid() {
    return self.uuid;
  };

  function setConnectionVisibility(visibility) {
    $timeout(() => {
      self.numberCtrl.jsplumbInstance
        .getAllConnections()
        .forEach((connection) => {
          connection.setVisible(visibility);
        });
    }, 99);
  }

  /**
   *  Used to determine if rules must be displayed or not.
   *  Used by telephonyNumberOvhPabxDialplanExtensionRuleEditCtrl when a rule edition is canceled.
   *  Used by telephonyNumberOvhPabxDialplanExtensionRuleCtrl when a rule is deleted.
   */
  self.checkForDisplayHelpers = function checkForDisplayHelpers() {
    if (!self.extension.rules.length) {
      self.displayHelpers.collapsed = true;
      self.displayHelpers.expanded = false;
    }
  };

  /* -----  End of HELPERS  ------*/

  /*= ==============================
    =            ACTIONS            =
    =============================== */

  self.onExtensionOutsideClick = function onExtensionOutsideClick() {
    if (self.extension.status !== 'DELETE_PENDING') {
      return;
    }

    // cancel deletion confirm
    self.extension.status = 'OK';
  };

  /* ----------  ACTIVATE/DESACTIVATE  ----------*/

  self.toggleEnabledState = function toggleEnabledState() {
    self.loading.save = true;

    const actionPromise = self.extension.enabled
      ? self.extension.disable()
      : self.extension.enable();

    return actionPromise.finally(() => {
      self.loading.save = false;
    });
  };

  /* ----------  ADD RULE  ----------*/

  self.addRule = function addRule(isNegative) {
    if (!isNegative) {
      self.displayHelpers.collapsed = false;
      self.displayHelpers.expanded = true;
    } else {
      self.displayHelpers.negativeCollapsed = false;
      self.displayHelpers.negativeExpanded = true;
    }

    self.extension.addRule({
      position: isNegative
        ? self.extension.negativeRules.length + 1
        : self.extension.rules.length + 1,
      status: 'DRAFT',
      negativeAction: isNegative,
    });
  };

  /* ----------  MANAGE CONDITIONS  ----------*/

  self.onManageConditionBtnClick = function onManageConditionBtnClick() {
    self.popoverStatus.isOpen = true;
  };

  /* ----------  DELETE  ----------*/

  /**
   *  Call API to delete extension
   */
  self.onConfirmDeleteBtnClick = function onConfirmDeleteBtnClick() {
    return self.extension
      .remove()
      .then(
        () => {
          // remove extension from list
          self.dialplan.removeExtension(self.extension);

          // check for other extensions that position needs to be updated
          // self.extension is not destroyed yet so use it to determine
          // which extensions needs to update their positions
          self.dialplan.updateExtensionsPositions(self.extension.position);

          // display information about extension count
          self.dialplanCtrl.checkForDisplayHelpers();
        },
        (error) => {
          TucToast.error(
            [
              $translate.instant(
                'telephony_number_feature_ovh_pabx_step_remove_error',
              ),
              (error.data && error.data.message) || '',
            ].join(' '),
          );
          return $q.reject(error);
        },
      )
      .finally(() => {
        self.loading.save = false;
      });
  };

  /* ----------  COLLAPSE  ---------- */

  self.onExtensionCollapsed = function onExtensionCollapsed(isNegative) {
    self.numberCtrl.jsplumbInstance.customRepaint().then(() => {
      setConnectionVisibility(true);
      set(
        self.displayHelpers,
        isNegative ? 'negativeExpanded' : 'expanded',
        false,
      );
    });
  };

  self.onExtensionExpanded = function onExtensionExpanded() {
    self.numberCtrl.jsplumbInstance.customRepaint().then(() => {
      setConnectionVisibility(true);
    });
  };

  self.onExtensionCollapsing = function onExtensionCollapsing() {
    setConnectionVisibility(false);
  };

  self.onExtensionExpanding = function onExtensionExpanding(isNegative) {
    set(
      self.displayHelpers,
      isNegative ? 'negativeExpanded' : 'expanded',
      true,
    );
  };

  /* -----  End of ACTIONS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function $onInit() {
    let sortInterval = null;
    let initPromise = $q.when(true);
    const sortableOptions = {
      axis: 'y',
      handle: '.rule-grip',
      cancel: '.voip-plan__step-icon--grip-disabled',
      containment: 'parent',
      sort: TUC_UI_SORTABLE_HELPERS.variableHeightTolerance,
      start() {
        sortInterval = setInterval(() => {
          self.numberCtrl.jsplumbInstance.repaintEverything();
        }, 33);
      },
      stop() {
        if (sortInterval) {
          clearInterval(sortInterval);

          // redraw links for the last time
          self.numberCtrl.jsplumbInstance.customRepaint();
        }
      },
    };

    self.loading.init = true;

    // set sortable options
    // for non negative rules
    self.rulesSortableOptions = angular.extend(
      {
        update() {
          $timeout(() => {
            // update extensions rules positions
            angular.forEach(self.extension.rules, (rule, index) => {
              set(rule, 'position', index + 1);
            });

            // call api to update all positions
            self.extension.updateRulesPositions();
          });
        },
      },
      sortableOptions,
    );

    // for negative rules
    self.negativeRulesSortableOptions = angular.extend(
      {
        update() {
          $timeout(() => {
            // update extensions rules positions
            angular.forEach(self.extension.negativeRules, (rule, index) => {
              set(rule, 'position', index + 1);
            });

            // call api to update all positions
            self.extension.updateRulesPositions(null, true);
          });
        },
      },
      sortableOptions,
    );

    self.ovhPabx = self.numberCtrl.number.feature;
    self.dialplan = self.dialplanCtrl.dialplan;
    self.uuid = uniqueId(
      'ovhPabx_diaplan_extension_'.concat(self.extension.extensionId),
    );

    if (['DRAFT', 'IN_CREATION'].indexOf(self.extension.status) === -1) {
      initPromise = $q.allSettled([
        self.extension.getRules(),
        self.extension.getScreenListConditions(),
        self.extension.getTimeConditions(),
      ]);
    }

    return initPromise.finally(() => {
      self.loading.init = false;
    });
  };

  /* -----  End of INITIALIZATION  ------*/
}
