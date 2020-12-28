export default /* @ngInject */ function TelecomTelephonyLineConsumptionCtrl(
  $translate,
) {
  const self = this;

  self.actions = null;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.actions = [
      {
        name: 'line_consumption_incoming_calls',
        main: true,
        picto: 'ovh-font-callReceiving',
        sref: 'telecom.telephony.billingAccount.line.consumption.incomingCalls',
        text: $translate.instant(
          'telephony_line_management_actions_line_consumption_incoming_calls',
        ),
      },
      {
        name: 'line_consumption_outgoing_calls',
        main: true,
        picto: 'ovh-font-callEmitting',
        sref: 'telecom.telephony.billingAccount.line.consumption.outgoingCalls',
        text: $translate.instant(
          'telephony_line_management_actions_line_consumption_outgoing_calls',
        ),
      },
      {
        name: 'line_consumption_incoming_fax',
        main: true,
        picto: 'ovh-font-faxReceiving',
        sref: 'telecom.telephony.billingAccount.line.consumption.incomingFax',
        text: $translate.instant(
          'telephony_line_management_actions_line_consumption_incoming_fax',
        ),
      },
      {
        name: 'line_consumption_outgoing_fax',
        main: true,
        picto: 'ovh-font-faxEmitting',
        sref: 'telecom.telephony.billingAccount.line.consumption.outgoingFax',
        text: $translate.instant(
          'telephony_line_management_actions_line_consumption_outgoing_fax',
        ),
      },
    ];
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
