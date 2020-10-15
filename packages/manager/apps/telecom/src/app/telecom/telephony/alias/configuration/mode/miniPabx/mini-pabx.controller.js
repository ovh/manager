import filter from 'lodash/filter';
import get from 'lodash/get';
import pick from 'lodash/pick';

export default /* @ngInject */ function TelecomTelephonyAliasConfigurationModeMiniPabxCtrl(
  $q,
  $translate,
  $stateParams,
  TelephonyMediator,
  OvhApiTelephony,
  OvhApiTelephonyMiniPabx,
  TucToast,
) {
  const self = this;

  self.loading = {
    init: false,
    save: false,
  };

  self.number = null;
  self.enums = null;
  self.options = null;
  self.formOptions = null;

  /* ==============================
    =            HELPERS            =
    =============================== */

  function fetchEnums() {
    return OvhApiTelephony.v6()
      .schema()
      .$promise.then((result) => {
        const enums = {};
        const tmpPatternEnum = get(result, [
          'models',
          'telephony.EasyMiniPabxHuntingPatternEnum',
          'enum',
        ]);
        enums.pattern = filter(
          tmpPatternEnum,
          (pattern) => pattern !== 'all-at-once',
        );
        enums.strategy = get(result, [
          'models',
          'telephony.EasyMiniPabxHuntingStrategyEnum',
          'enum',
        ]);
        return enums;
      });
  }

  function fetchHunting() {
    return OvhApiTelephonyMiniPabx.v6().getHunting({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }).$promise;
  }

  self.hasChanges = function hasChanges() {
    return !angular.equals(self.options, self.formOptions);
  };

  /* -----  End of HELPERS  ------ */

  /* =============================
    =            EVENTS            =
    ============================== */

  self.onOptionsFormSubmit = function onOptionsFormSubmit() {
    const attrs = [
      'anonymousCallRejection',
      'numberOfCalls',
      'pattern',
      'strategy',
      'onHoldTimer',
    ];

    self.loading.save = true;

    return OvhApiTelephonyMiniPabx.v6()
      .updateHunting(
        {
          billingAccount: $stateParams.billingAccount,
          serviceName: $stateParams.serviceName,
        },
        pick(self.formOptions, attrs),
      )
      .$promise.then(() => {
        self.options = angular.copy(self.formOptions);
        TucToast.success(
          $translate.instant(
            'telephony_alias_configuration_mode_mini_pabx_save_success',
          ),
        );
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_alias_configuration_mode_mini_pabx_save_error',
            ),
            get(error, 'data.message'),
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.save = false;
      });
  };

  self.onCancelBtnClick = function onCancelBtnClick() {
    self.formOptions = angular.copy(self.options);
  };

  /* -----  End of EVENTS  ------ */

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function $onInit() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.number = group.getNumber($stateParams.serviceName);

        return self.number.feature.init().then(() =>
          $q
            .all({
              enums: fetchEnums(),
              hunting: fetchHunting(),
            })
            .then((result) => {
              self.enums = result.enums;
              self.options = result.hunting;
              self.formOptions = angular.copy(result.hunting);
              self.voicemail = result.voicemail;
            }),
        );
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant(
              'telephony_alias_configuration_mode_mini_pabx_loading_error',
            ),
            get(error, 'data.message'),
          ].join(' '),
        );
        return $q.reject(error);
      })
      .finally(() => {
        self.loading.init = false;
      });
  };

  /* -----  End of INITIALIZATION  ------ */
}
