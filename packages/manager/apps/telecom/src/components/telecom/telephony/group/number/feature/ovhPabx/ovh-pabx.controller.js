import get from 'lodash/get';

export default /* @ngInject */ function TelephonyNumberOvhPabxCtrl(
  $q,
  $translate,
  $translatePartialLoader,
  asyncLoader,
  TelephonyMediator,
  TucToast,
) {
  const self = this;

  self.popoverDatas = {
    isOpen: false,
    configType: null,
  };

  self.loading = {
    dialplan: false,
    translations: false,
  };

  self.ovhPabx = null;
  self.dialplan = null;

  /*= ==============================
    =            HELPERS            =
    =============================== */

  self.refreshDisplayedDialplan = function refreshDisplayedDialplan() {
    // for the moment it will only have one dialplan per ovhPabx. So we take the first.
    self.dialplan = get(self.numberCtrl.number.feature.dialplans, '[0]');
  };

  self.displayedFeatureType = function displayedFeatureType() {
    const { featureType } = self.numberCtrl.number.feature;
    asyncLoader.addTranslations(
      import(
        `./types/${featureType}/translations/Messages_${$translate.use()}.json`
      )
        .catch(() =>
          import(
            `./types/${featureType}/translations/Messages_${$translate.fallbackLanguage()}.json`
          ),
        )
        .then((x) => x.default),
    );
    $translate.refresh();
  };

  /* -----  End of HELPERS  ------*/

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  /* ----------  Translations load  ----------*/

  function getTranslations() {
    self.loading.translations = true;

    // load ovhPabx translations
    $translatePartialLoader.addPart(
      '../components/telecom/telephony/group/number/feature/ovhPabx',
    );

    // load time condition slot transations
    $translatePartialLoader.addPart(
      '../components/telecom/telephony/timeCondition/slot',
    );

    // load specific types translations
    $translatePartialLoader.addPart(
      `../components/telecom/telephony/group/number/feature/ovhPabx/types/${self.ovhPabx.featureType}`,
    );
    return $translate.refresh().finally(() => {
      self.loading.translations = false;
    });
  }

  /* ----------  Component initialization  ----------*/

  self.$onInit = function $onInit() {
    let initPromises;

    // set loading
    self.numberCtrl.loading.feature = true;

    // set ovhPabx
    self.ovhPabx = self.numberCtrl.number.feature;

    return getTranslations()
      .then(() => {
        initPromises = [
          self.ovhPabx.getDialplans(),
          self.ovhPabx.getSounds(),
          TelephonyMediator.getAll(),
        ];

        if (
          self.ovhPabx.featureType === 'cloudIvr' ||
          self.ovhPabx.featureType === 'contactCenterSolutionExpert'
        ) {
          initPromises.push(self.ovhPabx.getMenus(true));
        }
        if (self.ovhPabx.featureType !== 'cloudIvr') {
          initPromises.push(self.ovhPabx.getQueues());
          if (self.ovhPabx.isCcs()) {
            initPromises.push(self.ovhPabx.getTts());
          }
        }

        return $q.allSettled(initPromises);
      })
      .then(() => {
        self.refreshDisplayedDialplan();
        self.displayedFeatureType();
      })
      .finally(() => {
        self.numberCtrl.loading.feature = false;
      })
      .catch((error) => {
        TucToast.error(
          $translate.instant('telephony_number_feature_ovh_pabx_load_error'),
        );
        return $q.reject(error);
      });
  };

  /* -----  End of INITIALIZATION  ------*/
}
