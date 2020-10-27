export default /* @ngInject */ function telephonyNumberOvhPabxSoundPopoverSectionCtrl(
  $translate,
  $translatePartialLoader,
) {
  const self = this;

  self.loading = {
    init: false,
    translations: false,
  };

  self.model = {
    soundFile: null,
  };

  self.uploadErrors = null;

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

  /* -----  End of HELPERS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /* ----------  Translations load  ----------*/

  function getTranslations() {
    self.loading.translations = true;

    $translatePartialLoader.addPart(
      '../components/telecom/telephony/group/number/feature/ovhPabx/sound/popover-section',
    );
    return $translate.refresh().finally(() => {
      self.loading.translations = false;
    });
  }

  /* ----------  Component initialization  ----------*/

  self.$onInit = function $onInit() {
    if (!self.numberCtrl && !self.ovhPabx) {
      throw new Error(
        'telephonyNumberOvhPabxSoundPopoverSection must have telephonyNumber component as parent or must have ovhPabx attribute specified',
      );
    }

    self.loading.init = true;

    if (!self.ovhPabx) {
      self.ovhPabx = self.numberCtrl.number.feature;
    }

    return getTranslations().finally(() => {
      self.loading.init = false;
    });
  };

  /* -----  End of INITIALIZATION  ------*/
}
