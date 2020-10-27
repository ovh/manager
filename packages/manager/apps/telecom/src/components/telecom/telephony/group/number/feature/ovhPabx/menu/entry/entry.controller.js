import get from 'lodash/get';
import uniqueId from 'lodash/uniqueId';

export default /* @ngInject */ function telephonyNumberOvhPabxMenuEntryCtrl(
  $q,
) {
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

  self.isLoading = function isLoading() {
    return (
      self.loading.init ||
      (self.menuEntry &&
        ['OK', 'DRAFT', 'DELETE_PENDING', 'MENUSUB_PENDING'].indexOf(
          self.menuEntry.status,
        ) === -1)
    );
  };

  self.isDisabled = function isDisabled() {
    return self.extensionCtrl && !self.extensionCtrl.extension.enabled;
  };

  self.getEntryAttribute = function getEntryAttribute(attr) {
    if (self.menuEntry.status === 'MENUSUB_PENDING') {
      return get(self.menuEntry, attr);
    }
    return get(
      self.menuEntry.inEdition ? self.menuEntry.saveForEdition : self.menuEntry,
      attr,
    );
  };

  self.getConnectionEndpointUuid = function getConnectionEndpointUuid() {
    let connectionEndpointUuid = `menu-endpoint-${self.menuEntry.menuId}`;

    if (self.menuCtrl.menuEntry) {
      connectionEndpointUuid += `-menu-entry-${self.menuCtrl.menuEntry.entryId}`;
    } else if (self.menuCtrl.dialplanRule) {
      connectionEndpointUuid += `-dialplan-rule-${self.menuCtrl.dialplanRule.ruleId}`;
    }

    return connectionEndpointUuid;
  };

  self.getParentEndpointUuid = function getParentEndpointUuid() {
    return self.parentCtrl.uuid;
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  self.onEditButtonClick = function onEditButtonClick() {
    self.parentCtrl.popoverStatus.isParentClicked = false;
    self.popoverTemplateUrl =
      'components/telecom/telephony/group/number/feature/ovhPabx/menu/entry/edit/edit.html';
    self.popoverStatus.isOpen = true;
  };

  self.onConfirmDeleteButtonClick = function onConfirmDeleteButtonClick() {
    return self.menuEntry.remove().then(() => {
      self.menuCtrl.menu.removeEntry(self.menuEntry);
      self.menuEntry = null;
      self.menuCtrl.checkForDisplayHelpers();
    });
  };

  self.onEntryOutsideClick = function onEntryOutsideClick() {
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

  self.$onInit = function $onInit() {
    const initPromise = [];

    // set component to init status
    self.loading.init = true;

    // set popover template url
    self.popoverTemplateUrl =
      'components/telecom/telephony/group/number/feature/ovhPabx/menu/entry/edit/edit.html';

    // set parent controller to get parent endpoint uuid
    self.parentCtrl = self.menuCtrl || self.extensionCtrl;

    // set ovh pabx
    self.ovhPabx = self.parentCtrl.ovhPabx;
    self.uuid = uniqueId('ovhPabx_menu_entry_'.concat(self.menuEntry.entryId)); // set controller unique id
    // check if popover needs to be opened
    self.popoverStatus.isOpen =
      self.menuEntry.status === 'DRAFT' &&
      self.parentCtrl.popoverStatus.isParentClicked;

    // set menu sub info if needed
    if (self.menuEntry.action === 'menuSub' && self.menuEntry.actionParam) {
      self.menuEntry.menuSub = self.menuCtrl.ovhPabx.getMenu(
        self.menuEntry.actionParam,
      );
      initPromise.push(self.menuEntry.menuSub.getEntries());
    }

    return $q.allSettled(initPromise).finally(() => {
      self.loading.init = false;
    });
  };

  self.$onDestroy = function $onDestroy() {
    if (self.menuEntry) {
      self.menuEntry.stopEdition(true);
    }
  };

  /* -----  End of INITIALIZATION  ------*/
}
