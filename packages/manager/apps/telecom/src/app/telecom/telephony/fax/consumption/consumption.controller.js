import get from 'lodash/get';

export default /* @ngInject */ function TelecomTelephonyFaxConsumptionCtrl(
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
        name: 'fax_information',
        main: true,
        picto: 'ovh-font-faxReceiving',
        sref: 'telecom.telephony.billingAccount.fax.consumption.incomingFax',
        text: $translate.instant(
          'telephony_group_fax_consumption_action_incoming_fax',
        ),
      },
      {
        name: 'fax_information',
        main: true,
        picto: 'ovh-font-faxEmitting',
        sref: 'telecom.telephony.billingAccount.fax.consumption.outgoingFax',
        text: $translate.instant(
          'telephony_group_fax_consumption_action_outgoing_fax',
        ),
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
