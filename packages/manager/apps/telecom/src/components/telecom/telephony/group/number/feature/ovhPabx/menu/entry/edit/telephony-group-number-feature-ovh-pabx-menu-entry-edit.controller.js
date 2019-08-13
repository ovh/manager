angular.module('managerApp').controller('telephonyNumberOvhPabxMenuEntryEditCtrl', function ($scope, $q, $timeout, $translate, TelephonyMediator, TucToast) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.model = {
    singleDigitKey: true,
  };

  self.ovhPabx = null;
  self.menuEntryCtrl = null;
  self.availableActions = null;
  self.availableDtmfKeys = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function getAvailableDtmfKeys() {
    return _.chunk(self.menuEntryCtrl.menuCtrl.menu.getAllDtmfEntryKeys(), 3);
  }

  function manageEntryRemove() {
    self.menuEntryCtrl.menuCtrl.menu.removeEntry(self.menuEntryCtrl.menuEntry);
  }

  self.isMenuEntryValid = function () {
    if (self.menuEntryCtrl.menuEntry.action === 'playback') {
      return !!self.menuEntryCtrl.menuCtrl.ovhPabx
        .getSound(self.menuEntryCtrl.menuEntry.actionParam);
    } if (self.menuEntryCtrl.menuEntry.action === 'menuSub') {
      return self.menuEntryCtrl.menuEntry.actionParam !== '';
    }
    return true;
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  self.onLeftPageButtonClick = function (rightPage) {
    self.menuEntryCtrl.popoverStatus.move = true;
    self.menuEntryCtrl.popoverStatus.rightPage = rightPage;
    if (rightPage === 'dtmf') {
      // refresh available dtmf keys when right page is dtmf
      self.availableDtmfKeys = getAvailableDtmfKeys();
    }
    $timeout(angular.noop, 99); // to avoid popover move
  };

  /* ----------  DTMF EVENTS  ----------*/

  self.onDtmfKeyButtonClick = function (key) {
    if (self.model.singleDigitKey) {
      self.menuEntryCtrl.menuEntry.dtmf = key;
      self.menuEntryCtrl.popoverStatus.move = false;
    } else {
      self.menuEntryCtrl.menuEntry.dtmf += key;
    }
  };

  /* ----------  ACTION EVENTS  ----------*/

  self.onMenuEntryActionChange = function () {
    self.menuEntryCtrl.popoverStatus.move = false;
    self.menuEntryCtrl.menuEntry.actionParam = '';
  };

  /* ----------  PLAYBACK ACTIONS  ----------*/

  self.onPlaybackSoundChange = function (sound) {
    self.menuEntryCtrl.popoverStatus.move = false;
    self.menuEntryCtrl.menuEntry.actionParam = sound.soundId;
  };

  /* ----------  MENU SUB ACTIONS  ----------*/

  self.onAddSubMenuButtonClick = function () {
    // close popover
    self.menuEntryCtrl.popoverStatus.isOpen = false;

    // create sub menu for menu entry
    self.menuEntryCtrl.menuEntry.menuSub = self.menuEntryCtrl.menuCtrl.ovhPabx.addMenu({
      name: $translate.instant('telephony_number_feature_ovh_pabx_menu_entry_edit_menu_sub_add_menu_new_name', {
        index: self.menuEntryCtrl.menuCtrl.ovhPabx.menus.length + 1,
      }),
      oldParent: angular.copy(self.menuEntryCtrl.menuEntry.saveForEdition),
      status: 'DRAFT',
    });

    // stop edition of menu entry
    self.menuEntryCtrl.menuEntry.stopEdition();
  };

  self.onSubMenuSelectedChange = function (menu) {
    self.menuEntryCtrl.popoverStatus.move = false;
    self.menuEntryCtrl.menuEntry.menuSub = menu;
  };

  /* ----------  FOOTER BUTTONS EVENTS  ----------*/

  self.onValidateBtnClick = function () {
    // define api call
    const actionPromise = self.menuEntryCtrl.menuEntry.status === 'DRAFT' ? self.menuEntryCtrl.menuEntry.create() : self.menuEntryCtrl.menuEntry.save();

    // close popover
    self.menuEntryCtrl.popoverStatus.isOpen = false;

    // manage action result
    return actionPromise.then(() => {
      self.menuEntryCtrl.menuEntry.stopEdition();
      self.menuEntryCtrl.menuCtrl.jsplumbInstance.customRepaint();
    }).catch((error) => {
      // manage error display
      const errorTranslationKey = self.menuEntryCtrl.menuEntry.status === 'DRAFT' ? 'telephony_number_feature_ovh_pabx_menu_entry_create_error' : 'telephony_number_feature_ovh_pabx_menu_entry_edit_error';
      TucToast.error([$translate.instant(errorTranslationKey), _.get(error, 'data.message') || ''].join(' '));

      // remove entry from menu if entry had to be created
      if (self.menuEntryCtrl.menuEntry.status === 'DRAFT') {
        manageEntryRemove();
      }
      self.menuEntryCtrl.menuEntry.stopEdition(true);
      return $q.reject(error);
    });
  };

  self.onCancelBtnClick = function () {
    // close popover
    self.menuEntryCtrl.popoverStatus.isOpen = false;
    self.menuEntryCtrl.popoverStatus.move = false;

    // remove entry if status is DRAFT
    if (self.menuEntryCtrl.menuEntry.status === 'DRAFT') {
      manageEntryRemove();
      self.menuEntryCtrl.menuCtrl.checkForDisplayHelpers();
    } else {
      self.menuEntryCtrl.menuEntry.stopEdition(true);
    }
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function getAvailableActions() {
    return TelephonyMediator.getApiModelEnum('telephony.OvhPabxIvrMenuEntryActionEnum').then((enumValues) => {
      self.availableActions = _.chain(enumValues).filter((enumVal) => {
        if (self.menuEntryCtrl.menuCtrl.ovhPabx.featureType === 'cloudIvr') {
          return enumVal !== 'callcenter';
        }
        return true;
      }).map(enumVal => ({
        value: enumVal,
        label: $translate.instant(`telephony_number_feature_ovh_pabx_menu_entry_action_${_.snakeCase(enumVal)}`),
        explain: $translate.instant(`telephony_number_feature_ovh_pabx_menu_entry_action_${_.snakeCase(enumVal)}_explain`),
      })).value();
    });
  }

  self.$onInit = function () {
    self.loading.init = true;

    // set parent controller
    self.menuEntryCtrl = $scope.$parent.$ctrl;

    // set ovhPabx
    self.ovhPabx = self.menuEntryCtrl.menuCtrl.ovhPabx;

    return getAvailableActions().then(() => {
      // set single digit key model
      self.model.singleDigitKey = self.menuEntryCtrl.menuEntry.dtmf.length === 1;

      // start menu entry edition
      self.menuEntryCtrl.menuEntry.startEdition();
    }).finally(() => {
      self.loading.init = false;
    });
  };

  self.$onDestroy = function () {
    if (self.menuEntryCtrl.menuEntry.inEdition.status === 'DRAFT') {
      self.menuEntryCtrl.menuCtrl.menu.removeEntry(self.menuEntryCtrl.menuEntry);
    }
  };

  /* -----  End of INITIALIZATION  ------*/
});
