angular.module('managerApp').controller('TelecomTelephonyLineFaxCtrl', function ($translate, TelecomMediator) {
  const self = this;

  self.actions = null;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.actions = [{
      name: 'line_password',
      sref: 'telecom.telephony.line.fax.password',
      text: $translate.instant('telephony_line_fax_action_line_password'),
    }, {
      name: 'line_settings',
      sref: 'telecom.telephony.line.fax.settings',
      text: $translate.instant('telephony_line_fax_action_line_settings'),
    }, {
      name: 'line_white_label_domains',
      sref: 'telecom.telephony.line.fax.customDomains',
      text: $translate.instant('telephony_line_fax_action_line_white_label_domains'),
      disabled: !TelecomMediator.isVip,
    }, {
      name: 'line_filtering',
      sref: 'telecom.telephony.line.fax.filtering',
      text: $translate.instant('telephony_line_fax_action_line_filtering'),
    }, {
      name: 'line_campaign_management',
      sref: 'telecom.telephony.line.fax.campaigns',
      text: $translate.instant('telephony_line_fax_action_line_campaigns'),
    }, {
      name: 'line_convert_to_ecofax_pro',
      sref: 'telecom.telephony.line.fax.convertToVoicefax',
      text: $translate.instant('telephony_line_fax_action_line_convert_to_voicefax'),
    }];
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
