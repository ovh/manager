angular.module('managerApp').controller('TelecomTelephonyBillingAccountAdministrationCtrl', function ($translate) {
  const self = this;

  self.actions = null;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.actions = [{
      name: 'group_billing_options',
      sref: 'telecom.telephony.administration.optionsGroup',
      text: $translate.instant('telephony_group_admin_actions_group_billing_options'),
    }, {
      name: 'group_lines_group_change',
      sref: 'telecom.telephony.linesGroup',
      text: $translate.instant('telephony_group_admin_actions_group_lines_group_change'),
    }, {
      name: 'group_new_billing_account',
      sref: 'telecom.telephony.addGroup',
      text: $translate.instant('telephony_group_admin_actions_group_new_billing_account'),
    }, {
      name: 'group_delete_billing_account',
      sref: 'telecom.telephony.deleteGroup',
      text: $translate.instant('telephony_group_admin_actions_group_delete_billing_account'),
    }, {
      name: 'telephony_group_admin_actions_portabilities',
      sref: "telecom.telephony.alias.portabilities({ serviceName: 'default'})",
      text: $translate.instant('telephony_group_admin_actions_portabilities'),
    }];
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
});
