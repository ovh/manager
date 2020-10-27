import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyFaxAssistCtrl(
  $q,
  $stateParams,
  $translate,
  TelephonyMediator,
  TucToast,
) {
  const self = this;

  self.loading = {
    init: false,
  };

  self.fax = null;
  self.actions = null;

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  function initActions() {
    const actions = [
      {
        name: 'fax_assist_logs',
        sref: 'telecom.telephony.billingAccount.fax.assist.logs',
        text: $translate.instant('telephony_group_fax_assist_action_logs'),
      },
      {
        name: 'fax_assist_logs',
        sref: 'telecom.telephony.billingAccount.fax.assist.support',
        main: true,
        picto: 'ovh-font-docs',
        text: $translate.instant('telephony_group_fax_assist_action_support'),
      },
      {
        name: 'fax_assist_orders',
        sref: 'telecom.telephony.billingAccount.fax.assist.orders',
        text: $translate.instant('telephony_group_fax_assist_action_orders'),
      },
    ];

    self.actions = actions;
  }

  self.$onInit = function $onInit() {
    self.loading.init = true;

    return TelephonyMediator.getGroup($stateParams.billingAccount)
      .then((group) => {
        self.fax = group.getFax($stateParams.serviceName);
        initActions();
      })
      .catch((error) => {
        TucToast.error(
          [
            $translate.instant('telephony_fax_loading_error'),
            get(error, 'data.message', ''),
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
