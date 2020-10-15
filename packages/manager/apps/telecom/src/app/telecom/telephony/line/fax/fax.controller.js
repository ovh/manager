export default /* @ngInject */ function TelecomTelephonyLineFaxCtrl(
  $translate,
  TelecomMediator,
) {
  const self = this;

  self.actions = null;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.actions = [
      {
        name: 'line_password',
        sref: 'telecom.telephony.billingAccount.line.fax.password',
        text: $translate.instant('telephony_line_fax_action_line_password'),
      },
      {
        name: 'line_settings',
        sref: 'telecom.telephony.billingAccount.line.fax.settings',
        text: $translate.instant('telephony_line_fax_action_line_settings'),
      },
      {
        name: 'line_white_label_domains',
        sref: 'telecom.telephony.billingAccount.line.fax.customDomains',
        text: $translate.instant(
          'telephony_line_fax_action_line_white_label_domains',
        ),
        disabled: !TelecomMediator.isVip,
      },
      {
        name: 'line_filtering',
        sref: 'telecom.telephony.billingAccount.line.fax.filtering',
        text: $translate.instant('telephony_line_fax_action_line_filtering'),
      },
      {
        name: 'line_campaign_management',
        sref: 'telecom.telephony.billingAccount.line.fax.campaigns',
        text: $translate.instant('telephony_line_fax_action_line_campaigns'),
      },
      {
        name: 'line_convert_to_ecofax_pro',
        sref: 'telecom.telephony.billingAccount.line.fax.convertToVoicefax',
        text: $translate.instant(
          'telephony_line_fax_action_line_convert_to_voicefax',
        ),
      },
    ];
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
