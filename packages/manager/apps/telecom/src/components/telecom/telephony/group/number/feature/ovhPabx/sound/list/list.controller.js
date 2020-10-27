import head from 'lodash/head';
import isFunction from 'lodash/isFunction';

export default /* @ngInject */ function telephonyNumberOvhPabxSoundListCtrl(
  $timeout,
  $translate,
  $translatePartialLoader,
) {
  const self = this;

  self.loading = {
    init: false,
    translations: false,
  };

  self.orderDesc = false;
  self.askedSoundDelete = null;

  /*= =============================
    =            EVENTS            =
    ============================== */

  self.onSelectedSoundChanged = function onSelectedSoundChanged(sound) {
    $timeout(() => {
      if (self.onSoundSelected && isFunction(self.onSoundSelected())) {
        self.onSoundSelected()(sound);
      }
    });
  };

  self.onSoundeDeleteConfirm = function onSoundeDeleteConfirm(sound) {
    return sound
      .remove()
      .then(() => {
        self.ovhPabx.removeSound(sound);
      })
      .finally(() => {
        self.loading.deleting = false;
      });
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /* ----------  Translations load  ----------*/

  function getTranslations() {
    self.loading.translations = true;

    $translatePartialLoader.addPart(
      '../components/telecom/telephony/group/number/feature/ovhPabx/sound/list',
    );
    return $translate.refresh().finally(() => {
      self.loading.translations = false;
    });
  }

  /* ----------  Component initialization  ----------*/

  self.$onInit = function $onInit() {
    if (!self.numberCtrl && !self.ovhPabx) {
      throw new Error(
        'telephonyNumberOvhPabxSoundList must have telephonyNumber component as parent or must have ovhPabx attribute specified',
      );
    }

    self.loading.init = true;

    if (!self.ovhPabx) {
      self.ovhPabx = self.numberCtrl.number.feature;
    }

    if (self.ovhPabx.sounds && self.ovhPabx.sounds.length === 1) {
      self.selectedSound = head(self.ovhPabx.sounds).soundId;
    }

    return getTranslations().finally(() => {
      self.loading.init = false;
    });
  };

  /* -----  End of INITIALIZATION  ------*/
}
