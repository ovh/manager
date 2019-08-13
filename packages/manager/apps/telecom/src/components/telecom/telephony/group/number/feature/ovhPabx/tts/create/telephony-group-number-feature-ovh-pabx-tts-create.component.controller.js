angular.module('managerApp').controller('telephonyNumberOvhPabxTtsCreateCtrl', function ($q, $translate, $translatePartialLoader, TelephonyGroupNumberOvhPabxTts, TelephonyMediator, TucToast, TucToastError) {
  const self = this;

  self.loading = {
    init: false,
    translations: false,
    creating: false,
  };

  self.model = {
    voice: null,
    text: null,
  };

  self.availableVoices = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  function resetTtsModel() {
    self.model.voice = _.get(self.availableVoices, '[0].value');
    self.model.text = null;
    self.ttsCreateForm.$setPristine();
  }

  /* -----  End of HELPERS  ------*/

  /*= =============================
    =            EVENTS            =
    ============================== */

  self.onTtsCreateFormSubmit = function () {
    self.loading.creating = true;

    const tts = new TelephonyGroupNumberOvhPabxTts({
      billingAccount: self.ovhPabx.billingAccount,
      serviceName: self.ovhPabx.serviceName,
      voice: self.model.voice,
      text: self.model.text,
      status: 'DRAFT',
    });

    return tts.create().then(() => {
      self.ovhPabx.addTts(tts);
      resetTtsModel();
      if (self.onTtsCreationSuccess && _.isFunction(self.onTtsCreationSuccess())) {
        self.onTtsCreationSuccess()(tts);
      }
    }).catch((error) => {
      TucToast.error([$translate.instant('telephony_number_feature_ovh_pabx_tts_create_error'), _.get(error, 'data.message', '')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.creating = false;
    });
  };

  self.onCancelTtsBtnClick = function () {
    resetTtsModel();
    if (self.onTtsCreationCancel && _.isFunction(self.onTtsCreationCancel())) {
      self.onTtsCreationCancel()();
    }
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /* ----------  Translations load  ----------*/

  function getTranslations() {
    self.loading.translations = true;

    $translatePartialLoader.addPart('../components/telecom/telephony/group/number/feature/ovhPabx/tts/create');
    $translatePartialLoader.addPart('../components/telecom/telephony/group/number/feature/ovhPabx/tts');
    return $translate.refresh().finally(() => {
      self.loading.translations = false;
    });
  }

  /* ----------  Enum  ----------*/

  function getVoiceEnum() {
    return TelephonyMediator.getApiModelEnum('telephony.OvhPabxTtsVoiceEnum').then((enumValues) => {
      self.availableVoices = _.map(enumValues, value => ({
        value,
        label: $translate.instant(`telephony_number_feature_ovh_pabx_tts_voice_${value.toLowerCase()}`),
      }));
    });
  }

  /* ----------  Component initialization  ----------*/

  self.$onInit = function () {
    if (!self.numberCtrl && !self.ovhPabx) {
      throw new Error('telephonyNumberOvhPabxTtsCreate must have telephonyNumber component as parent or must have ovhPabx attribute specified');
    }

    self.loading.init = true;

    if (!self.ovhPabx) {
      self.ovhPabx = self.numberCtrl.number.feature;
    }

    if (!self.radioName) {
      self.radioName = 'ttsChoice';
    }
    self.idPrefix = _.kebabCase(self.radioName);

    return getTranslations().then(() => getVoiceEnum()).then(() => {
      resetTtsModel();
    }).finally(() => {
      self.loading.init = false;
    })
      .catch(error => new TucToastError(error));
  };

  /* -----  End of INITIALIZATION  ------*/
});
