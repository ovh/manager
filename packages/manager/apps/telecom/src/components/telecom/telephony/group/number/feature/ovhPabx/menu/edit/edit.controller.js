import get from 'lodash/get';
import set from 'lodash/set';

export default /* @ngInject */ function telephonyNumberOvhPabxMenuEditCtrl(
  $scope,
) {
  const self = this;

  self.model = {
    soundFile: null,
    greetSoundType: null,
    invalidSoundType: null,
  };

  self.state = {
    collapse: false,
  };

  self.menuCtrl = null;
  self.ovhPabx = null;
  self.menu = null;
  self.uploadErrors = null;
  self.availableSoundTypes = ['sound', 'tts'];

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.hasSoundFileError = function hasSoundFileError() {
    return (
      self.uploadErrors.extension ||
      self.uploadErrors.size ||
      self.uploadErrors.exists ||
      self.uploadErrors.name
    );
  };

  self.getSoundInfos = function getSoundInfos(soundType) {
    const isTts = ['greetSoundTts', 'invalidSoundTts'].indexOf(soundType) > -1;

    return !isTts
      ? get(self.menuCtrl.ovhPabx.getSound(get(self.menu, soundType)), 'name')
      : get(
          self.menuCtrl.ovhPabx.getSingleTts(get(self.menu, soundType)),
          'text',
        );
  };

  self.soundListModel = function soundListModel(soundId) {
    if (arguments.length) {
      // setter
      if (self.menuCtrl.popoverStatus.rightPage === 'greetSound') {
        // eslint-disable-next-line no-return-assign
        return (self.menu.greetSound = soundId);
      }
      // eslint-disable-next-line no-return-assign
      return (self.menu.invalidSound = soundId);
    }

    // getter
    return get(self.menu, self.menuCtrl.popoverStatus.rightPage);
  };

  /* ----------  FORM VALIDATION  ----------*/

  self.hasChange = function hasChange() {
    if (!self.menu) {
      return false;
    }
    return self.menu.status !== 'DRAFT' ? self.menu.hasChange() : true;
  };

  self.isMenuValid = function isMenuValid() {
    if (self.menu.greetSound || self.menu.greetSoundTts) {
      if (
        self.menuCtrl.ovhPabx.isTtsAvailable() &&
        self.model.invalidSoundType !== 'none' &&
        !self.menu.invalidSound &&
        !self.menu.invalidSoundTts
      ) {
        return false;
      }

      return true;
    }

    return false;
  };

  self.isFormValid = function isFormValid() {
    const ttsForm = get(self.menuOptionsForm, '$ctrl.ttsCreateForm');
    if (ttsForm) {
      return ttsForm.$dirty ? self.menuOptionsForm.$valid : true;
    }
    return self.menuOptionsForm.$valid;
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  /* ----------  Popover footer buttons actions  ----------*/

  /**
   *  On popover cancel button click
   */
  self.onCancelBtnClick = function onCancelBtnClick() {
    self.menuCtrl.popoverStatus.isOpen = false;
    self.menuCtrl.popoverStatus.move = false;
    self.menu.stopEdition(true);

    if (self.menu.status === 'DRAFT') {
      self.menuCtrl.ovhPabx.removeMenu(self.menu);
      self.menuCtrl.menu = null;

      if (
        self.menuCtrl.menuEntry &&
        self.menuCtrl.menuEntry.action === 'menuSub' &&
        self.menuCtrl.menuEntry.menuSub
      ) {
        if (self.menuCtrl.menuEntry.status === 'DRAFT') {
          self.menuCtrl.ovhPabx
            .getMenu(self.menuCtrl.menuEntry.menuId)
            .removeEntry(self.menuCtrl.menuEntry);
        } else {
          self.menuCtrl.menuEntry.stopEdition(
            true,
            self.menuCtrl.menuEntry.menuSub.oldParent,
          );
        }
        self.menuCtrl.menuEntry.stopEdition(true);
        self.menuCtrl.menuEntry.menuSub = null;
      } else if (
        self.menuCtrl.dialplanRule &&
        self.menuCtrl.dialplanRule.action === 'ivr' &&
        self.menuCtrl.dialplanRule.ivrMenu
      ) {
        if (self.menuCtrl.dialplanRule.status === 'DRAFT') {
          self.menuCtrl.extensionCtrl.extension.removeRule(
            self.menuCtrl.dialplanRule,
          );
        } else {
          self.menuCtrl.dialplanRule.stopEdition(
            true,
            self.menuCtrl.dialplanRule.ivrMenu.oldParent,
          );
        }
        self.menuCtrl.dialplanRule.stopEdition(true);
        self.menuCtrl.dialplanRule.ivrMenu = null;
      }

      // check for collapsing or not the rules into extension component view
      self.menuCtrl.checkForDisplayHelpers();
    }
  };

  /**
   *  On popover validate button click
   */
  self.onValidateBtnClick = function onValidateBtnClick() {
    let validatePromise = null;

    self.menuCtrl.popoverStatus.isOpen = false;

    if (self.menu.status === 'DRAFT') {
      validatePromise = self.menu.create();
    } else {
      validatePromise = self.menu.save();
    }

    return validatePromise
      .then(() => {
        if (
          self.menuCtrl.menuEntry &&
          self.menuCtrl.menuEntry.action === 'menuSub' &&
          self.menuCtrl.menuEntry.menuSub
        ) {
          // save menu entry if menu entry
          self.menuCtrl.menuEntry.actionParam = self.menu.menuId;
          return self.menuCtrl.menuEntry.status === 'DRAFT'
            ? self.menuCtrl.menuEntry.create()
            : self.menuCtrl.menuEntry.save();
        }
        if (
          self.menuCtrl.dialplanRule &&
          self.menuCtrl.dialplanRule.action === 'ivr' &&
          self.menuCtrl.dialplanRule.ivrMenu
        ) {
          // save dialplan extension rule
          self.menuCtrl.dialplanRule.actionParam = self.menu.menuId;
          return self.menuCtrl.dialplanRule.status === 'DRAFT'
            ? self.menuCtrl.dialplanRule.create()
            : self.menuCtrl.dialplanRule.save();
        }
        return null;
      })
      .then(() => {
        self.menu.stopEdition();
      });
  };

  /* ----------  Greet sound type  ----------*/

  self.onSoundTypeChoiceButtonClick = function onSoundTypeChoiceButtonClick(
    soundType,
  ) {
    self.menuCtrl.popoverStatus.move = true;
    self.menuCtrl.popoverStatus.rightPage = soundType;
  };

  self.onSoudTypeChange = function onSoudTypeChange() {
    if (self.menuCtrl.popoverStatus.rightPage === 'greetSoundType') {
      self.menu.greetSound = null;
      self.menu.greetSoundTts = null;
    } else if (self.menuCtrl.popoverStatus.rightPage === 'invalidSoundType') {
      self.menu.invalidSound = null;
      self.menu.invalidSoundTts = null;
    }
    self.menuCtrl.popoverStatus.move = false;
  };

  /* ----------  Sound file selection  ----------*/

  self.onSoundChoiceButtonClick = function onSoundChoiceButtonClick(soundType) {
    self.menuCtrl.popoverStatus.move = true;
    self.menuCtrl.popoverStatus.rightPage = soundType;
  };

  self.onSoundSelected = function onSoundSelected(sound) {
    self.menuCtrl.popoverStatus.move = false;
    if (self.menuCtrl.popoverStatus.rightPage === 'greetSound') {
      self.menu.greetSound = sound.soundId;
    } else {
      self.menu.invalidSound = sound.soundId;
    }
  };

  /* ----------  Tts sound  ----------*/

  self.onAddTtsButtonClick = function onAddTtsButtonClick() {
    self.state.collapse = true;
  };

  self.onTtsCreationCancel = function onTtsCreationCancel() {
    self.state.collapse = false;
  };

  self.onTtsCreationSuccess = function onTtsCreationSuccess(tts) {
    set(self.menuCtrl.menu, self.menuCtrl.popoverStatus.rightPage, tts.id);
    self.state.collapse = false;
    self.menuCtrl.popoverStatus.move = false;
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function $onInit() {
    self.menuCtrl = $scope.$parent.$ctrl;

    // set menu to edit
    self.menu = self.menuCtrl.menu;

    // set sound types
    // set greet sound type
    if (self.menu.greetSoundTts) {
      self.model.greetSoundType = 'tts';
    } else {
      self.model.greetSoundType = 'sound';
    }

    // set invalid sound type
    if (self.menu.invalidSoundTts) {
      self.model.invalidSoundType = 'tts';
    } else if (self.invalidSound || !self.menuCtrl.ovhPabx.isTtsAvailable()) {
      self.model.invalidSoundType = 'sound';
    } else {
      self.model.invalidSoundType = 'none';
    }

    // start menu edition
    self.menu.startEdition();
  };

  /* -----  End of INITIALIZATION  ------*/
}
