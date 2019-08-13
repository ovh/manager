angular.module('managerApp').controller('telephonyNumberOvhPabxMenuEntryCtrl', function ($q) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.popoverStatus = {
    isOpen: false,
    move: false,
    rightPage: null,
  };

  self.ovhPabx = null;
  self.popoverTemplateUrl = null;
  self.uuid = null;
  self.parentCtrl = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.isLoading = function () {
    return self.loading.init || (self.menuEntry && ['OK', 'DRAFT', 'DELETE_PENDING', 'MENUSUB_PENDING'].indexOf(self.menuEntry.status) === -1);
  };

  self.isDisabled = function () {
    return self.extensionCtrl && !self.extensionCtrl.extension.enabled;
  };

  self.getEntryAttribute = function (attr) {
    if (self.menuEntry.status === 'MENUSUB_PENDING') {
      return _.get(self.menuEntry, attr);
    }
    return _.get(self.menuEntry.inEdition ? self.menuEntry.saveForEdition : self.menuEntry, attr);
  };

  self.getConnectionEndpointUuid = function () {
    let connectionEndpointUuid = `menu-endpoint-${self.menuEntry.menuId}`;

    if (self.menuCtrl.menuEntry) {
      connectionEndpointUuid += `-menu-entry-${self.menuCtrl.menuEntry.entryId}`;
    } else if (self.menuCtrl.dialplanRule) {
      connectionEndpointUuid += `-dialplan-rule-${self.menuCtrl.dialplanRule.ruleId}`;
    }

    return connectionEndpointUuid;
  };

  self.getParentEndpointUuid = function () {
    return self.parentCtrl.uuid;
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  self.onEditButtonClick = function () {
    self.parentCtrl.popoverStatus.isParentClicked = false;
    self.popoverTemplateUrl = 'components/telecom/telephony/group/number/feature/ovhPabx/menu/entry/edit/telephony-group-number-feature-ovh-pabx-menu-entry-edit.html';
    self.popoverStatus.isOpen = true;
  };

  self.onConfirmDeleteButtonClick = function () {
    return self.menuEntry.remove().then(() => {
      self.menuCtrl.menu.removeEntry(self.menuEntry);
      self.menuEntry = null;
      self.menuCtrl.checkForDisplayHelpers();
    });
  };

  self.onEntryOutsideClick = function () {
    if (self.menuEntry.status !== 'DELETE_PENDING') {
      return;
    }

    // cancel delete confirm
    self.menuEntry.status = 'OK';
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function () {
    const initPromise = [];

    // set component to init status
    self.loading.init = true;

    // set popover template url
    self.popoverTemplateUrl = 'components/telecom/telephony/group/number/feature/ovhPabx/menu/entry/edit/telephony-group-number-feature-ovh-pabx-menu-entry-edit.html';

    // set parent controller to get parent endpoint uuid
    self.parentCtrl = self.menuCtrl || self.extensionCtrl;

    // set ovh pabx
    self.ovhPabx = self.parentCtrl.ovhPabx;
    self.uuid = _.uniqueId('ovhPabx_menu_entry_'.concat(self.menuEntry.entryId)); // set controller unique id
    // check if popover needs to be opened
    self.popoverStatus.isOpen = self.menuEntry.status === 'DRAFT' && self.parentCtrl.popoverStatus.isParentClicked;

    // set menu sub info if needed
    if (self.menuEntry.action === 'menuSub' && self.menuEntry.actionParam) {
      self.menuEntry.menuSub = self.menuCtrl.ovhPabx.getMenu(self.menuEntry.actionParam);
      initPromise.push(self.menuEntry.menuSub.getEntries());
    }

    return $q.allSettled(initPromise).finally(() => {
      self.loading.init = false;
    });
  };

  self.$onDestroy = function () {
    if (self.menuEntry) {
      self.menuEntry.stopEdition(true);
    }
  };

  /* -----  End of INITIALIZATION  ------*/
});
