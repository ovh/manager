export default /* @ngInject */ function voipTimeConditionCalendarCtrl(
  $q,
  $translate,
  $translatePartialLoader,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.eventSources = [];

  self.conditionInEdition = null;
  self.fcEventInEdition = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  /* -----  End of HELPERS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /* ----------  Load translations  ----------*/

  function getTranslations() {
    self.loading.translations = true;

    $translatePartialLoader.addPart(
      '../components/telecom/telephony/timeCondition/condition',
    );
    return $translate.refresh().finally(() => {
      self.loading.translations = false;
    });
  }

  /* ----------  Component initialization  ----------*/

  self.$onInit = function $onInit() {
    self.loading.init = true;

    return $q
      .all([getTranslations(), self.timeCondition.getConditions()])
      .finally(() => {
        self.loading.init = false;
      });
  };

  /* -----  End of INITIALIZATION  ------*/
}
