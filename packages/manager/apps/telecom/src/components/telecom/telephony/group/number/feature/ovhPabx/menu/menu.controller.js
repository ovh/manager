import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import isNumber from 'lodash/isNumber';
import uniqueId from 'lodash/uniqueId';

import {
  JSPLUMB_CONNECTIONS_OPTIONS,
  JSPLUMB_ENDPOINTS_OPTIONS,
} from '../../../number.constants';

export default /* @ngInject */ function telephonyNumberOvhPabxMenuCtrl(
  $q,
  $scope,
  $timeout,
  $translate,
  $translatePartialLoader,
  TucToast,
) {
  const self = this;

  self.loading = {
    translations: false,
    init: false,
    jsPlumb: false,
  };

  self.popoverStatus = {
    isOpen: false,
    move: false,
    templateUrl:
      'components/telecom/telephony/group/number/feature/ovhPabx/menu/edit/edit.html',
    isParentClicked: false,
  };

  self.displayHelpers = {
    collapsed: true,
    expanded: false,
  };

  self.jsPlumbEndpointsOptions = JSPLUMB_ENDPOINTS_OPTIONS;
  self.jsPlumbConnectionsOptions = JSPLUMB_CONNECTIONS_OPTIONS;
  self.uuid = uniqueId('ovhPabx_menu_');
  self.parentCtrl = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.isLoading = function isLoading() {
    return (
      self.loading.init ||
      (self.menu &&
        ['OK', 'DRAFT', 'DELETE_PENDING'].indexOf(self.menu.status) === -1)
    );
  };

  self.isDisabled = function isDisabled() {
    return self.extensionCtrl && !self.extensionCtrl.extension.enabled;
  };

  self.hasMenuEntryOrDialPlanExtension = function hasMenuEntryOrDialPlanExtension() {
    return !!(self.menuEntry || self.dialplanRule);
  };

  self.getParentEndpointUuid = function getParentEndpointUuid() {
    if (self.dialplanRule && self.dialplanRule.negativeAction) {
      return `${self.parentCtrl.uuid}-condition`;
    }
    return self.parentCtrl.uuid;
  };

  self.getEndpointUuid = function getEndpointUuid() {
    return self.uuid;
  };

  self.getEntryAttr = function getEntryAttr(attr, entryParam) {
    let entry = entryParam;
    if (!entry) {
      entry = self.menuEntry;
    }
    return get(entry.inEdition ? entry.saveForEdition : entry, attr);
  };

  self.getRuleAttr = function getRuleAttr(attr) {
    return get(
      self.dialplanRule.inEdition
        ? self.dialplanRule.saveForEdition
        : self.dialplanRule,
      attr,
    );
  };

  self.getDialplanRuleRealPosition = function getDialplanRuleRealPosition() {
    if (!self.extensionCtrl) {
      return 1;
    }
    return (
      indexOf(
        self.dialplanRule.negativeAction
          ? self.extensionCtrl.extension.negativeRules
          : self.extensionCtrl.extension.rules,
        self.dialplanRule,
      ) + 1
    );
  };

  self.getEntryMenu = function getEntryMenu(entry) {
    const entryActionParam = self.getEntryAttr('actionParam', entry);
    if (isNumber(entryActionParam)) {
      return self.ovhPabx.getMenu(entryActionParam);
    }
    return entry.menuSub;
  };

  function setConnectionVisibility(visibility) {
    $timeout(() => {
      self.jsplumbInstance.getAllConnections().forEach((connection) => {
        connection.setVisible(visibility);
      });
    }, 99);
  }

  /**
   *  Used to determine if extensions must be displayed or not.
   *  Used by telephonyNumberOvhPabxMenuEditCtrl when an entry is deleted/cancelled.
   */
  self.checkForDisplayHelpers = function checkForDisplayHelpers() {
    if (self.menu && !self.menu.entries.length) {
      self.displayHelpers.collapsed = true;
      self.displayHelpers.expanded = false;
    } else if (!self.menu && self.parentCtrl.checkForDisplayHelpers) {
      self.parentCtrl.checkForDisplayHelpers();
    }
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  self.onEditMenuBtnClick = function onEditMenuBtnClick() {
    self.popoverStatus.templateUrl =
      'components/telecom/telephony/group/number/feature/ovhPabx/menu/edit/edit.html';
    self.popoverStatus.isOpen = true;
  };

  self.onEditMenuEntryBtnClick = function onEditMenuEntryBtnClick() {
    self.popoverStatus.templateUrl =
      'components/telecom/telephony/group/number/feature/ovhPabx/menu/entry/edit/edit.html';
    self.popoverStatus.isOpen = true;
  };

  self.onDialplanRuleEditBtnClick = function onDialplanRuleEditBtnClick() {
    self.popoverStatus.templateUrl =
      'components/telecom/telephony/group/number/feature/ovhPabx/dialplan/extension/rule/edit/edit.html';
    self.popoverStatus.isOpen = true;
  };

  self.onDeleteCancelBtnClick = function onDeleteCancelBtnClick() {
    if (self.menu.status !== 'DRAFT') {
      if (!self.hasMenuEntryOrDialPlanExtension()) {
        self.menu.status = 'OK';
      } else if (self.menuEntry) {
        self.menuEntry.status = 'OK';
      } else if (self.dialplanRule) {
        self.dialplanRule.status = 'OK';
      }
    }
  };

  self.onMenuDeleteConfirmBtnClick = function onMenuDeleteConfirmBtnClick() {
    if (!self.hasMenuEntryOrDialPlanExtension()) {
      return self.menu
        .remove()
        .then(() => {
          self.ovhPabx.removeMenu(self.menu);
          self.menu = null;
        })
        .catch((error) => {
          let errorTranslationKey =
            'telephony_number_feature_ovh_pabx_menu_action_delete_error';
          if (error.status === 403) {
            errorTranslationKey =
              'telephony_number_feature_ovh_pabx_menu_action_delete_error_used';
          }
          TucToast.error($translate.instant(errorTranslationKey));
        });
    }
    if (self.menuEntry) {
      return self.menuEntry
        .remove()
        .then(() => {
          self.menuCtrl.menu.removeEntry(self.menuEntry);
          self.menuEntry = null;
          self.menuCtrl.checkForDisplayHelpers();
        })
        .catch((error) => {
          TucToast.error(
            [
              $translate.instant(
                'telephony_number_feature_ovh_pabx_menu_entry_delete_error',
              ),
              get(error, 'data.message') || '',
            ].join(' '),
          );
          return $q.reject(error);
        });
    }
    if (self.dialplanRule) {
      return self.dialplanRule
        .remove()
        .then(() => {
          self.extensionCtrl.extension.removeRule(self.dialplanRule);
          self.dialplanRule = null;
          self.extensionCtrl.checkForDisplayHelpers();
        })
        .catch((error) => {
          TucToast.error(
            [
              $translate.instant(
                'telephony_number_feature_ovh_pabx_menu_entry_delete_error',
              ),
              get(error, 'data.message') || '',
            ].join(' '),
          );
          return $q.reject(error);
        });
    }
    return $q.when(null);
  };

  self.addMenuEntry = function addMenuEntry() {
    self.popoverStatus.isParentClicked = true;
    self.displayHelpers.collapsed = false;
    self.displayHelpers.expanded = true;

    return self.menu.addEntry({
      position: self.menu.entries.length + 1,
      dtmf: self.menu.getFirstAvailableDtmfEntryKey(),
      status: 'DRAFT',
    });
  };

  /* ----------  COLLAPSE  ---------- */

  self.onEntryCollapsed = function onEntryCollapsed() {
    self.jsplumbInstance.customRepaint().then(() => {
      setConnectionVisibility(true);
      self.displayHelpers.expanded = false;
    });
  };

  self.onEntryExpanded = function onEntryExpanded() {
    self.jsplumbInstance.customRepaint().then(() => {
      setConnectionVisibility(true);
    });
  };

  self.onEntryCollapsing = function onEntryCollapsing() {
    setConnectionVisibility(false);
  };

  self.onEntryExpanding = function onEntryExpanding() {
    self.displayHelpers.expanded = true;
  };

  self.onMenuOutsideClick = function onMenuOutsideClick() {
    if (
      (self.menuEntry && self.menuEntry.status === 'DELETE_PENDING') ||
      (self.dialplanRule && self.dialplanRule.status === 'DELETE_PENDING') ||
      (self.menu && self.menu.status === 'DELETE_PENDING')
    ) {
      return;
    }
    // cancel the deletion conirm
    self.onDeleteCancelBtnClick();
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /* ----------  Translations load  ----------*/

  function getTranslations() {
    self.loading.translations = true;

    $translatePartialLoader.addPart(
      '../components/telecom/telephony/group/number/feature/ovhPabx',
    );
    $translatePartialLoader.addPart(
      '../components/telecom/telephony/group/number/feature/ovhPabx/menu',
    );
    $translatePartialLoader.addPart(
      '../components/telecom/telephony/group/number/feature/ovhPabx/tts',
    );
    return $translate.refresh().finally(() => {
      self.loading.translations = false;
    });
  }

  /* ----------  Component initialization  ----------*/

  self.$onInit = function $onInit() {
    const initPromises = {
      translations: getTranslations(),
    };

    if (!self.numberCtrl && !self.menuCtrl && !self.ovhPabx) {
      throw new Error(
        'telephonyNumberOvhPabxMenu must have telephonyNumber or telephonyNumberOvhPabxMenu component as parent or must have ovhPabx attribute specified',
      );
    }

    self.loading.init = true;

    // set ovhPabx from number component if needed
    if (!self.ovhPabx) {
      self.ovhPabx = self.numberCtrl
        ? self.numberCtrl.number.feature
        : self.menuCtrl.ovhPabx;
    }

    // set jsplumb instance from number component if needed
    if (!self.jsplumbInstance) {
      self.jsplumbInstance = self.numberCtrl
        ? self.numberCtrl.jsplumbInstance
        : self.menuCtrl.jsplumbInstance;
    }

    self.popoverStatus.isOpen = self.menu && self.menu.status === 'DRAFT';

    // set parent ctrl to get uuid
    self.parentCtrl = self.menuCtrl || self.extensionCtrl || {};

    // set controller uuid
    self.uuid = uniqueId('ovhPabx_menu_'.concat(get(self.menu, 'menuId', '')));

    return $q.all(initPromises).finally(() => {
      self.loading.init = false;
    });
  };

  self.$onDestroy = function $onDestroy() {
    if (self.menu) {
      self.menu.stopEdition(true);
    }
  };

  $scope.$watch('$ctrl.menu.menuId', (newMenuId, oldMenuId) => {
    if (oldMenuId && oldMenuId !== newMenuId) {
      $timeout(() => {
        self.$onInit();
      });
    }
  });

  /* -----  End of INITIALIZATION  ------*/
}
