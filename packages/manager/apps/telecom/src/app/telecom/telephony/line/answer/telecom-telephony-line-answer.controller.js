angular.module('managerApp').controller('TelecomTelephonyLineAnswerCtrl', function ($translate) {
  const self = this;

  self.actions = null;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.actions = [{
      name: 'line_default_voicemail',
      sref: 'telecom.telephony.line.defaultVoicemail',
      text: $translate.instant('telephony_line_answer_actions_line_default_voicemail'),
    }, {
      name: 'line_voicemail_password',
      sref: 'telecom.telephony.line.voicemailPassword',
      text: $translate.instant('telephony_line_answer_actions_line_voicemail_password'),
    }, {
      name: 'line_voicemail_options',
      sref: 'telecom.telephony.line.voicemailOptions',
      text: $translate.instant('telephony_line_answer_actions_line_voicemail_options'),
    }, {
      name: 'line_voicemail_management',
      main: true,
      picto: 'ovh-font-messagesRead',
      sref: 'telecom.telephony.line.voicemailManagement',
      text: $translate.instant('telephony_line_answer_actions_line_voicemail_management'),
    }];
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
