export default class TelecomTelephonyBillingAccountAdministrationCtrl {
  /* @ngInject */
  constructor($q, $translate, telecomBillingAccountAdministrationService) {
    this.$q = $q;
    this.$translate = $translate;
    this.actions = null;
    this.telecomBillingAccountAdministrationService = telecomBillingAccountAdministrationService;
  }

  $onInit() {
    this.actions = [
      {
        name: 'group_billing_options',
        sref: 'telecom.telephony.billingAccount.administration.optionsGroup',
        text: this.$translate.instant(
          'telephony_group_admin_actions_group_billing_options',
        ),
      },
      {
        name: 'group_lines_group_change',
        sref: 'telecom.telephony.billingAccount.administration.linesGroup',
        text: this.$translate.instant(
          'telephony_group_admin_actions_group_lines_group_change',
        ),
      },
      {
        name: 'group_new_billing_account',
        sref: 'telecom.telephony.billingAccount.administration.addGroup',
        text: this.$translate.instant(
          'telephony_group_admin_actions_group_new_billing_account',
        ),
      },
      {
        name: 'group_delete_billing_account',
        sref: 'telecom.telephony.billingAccount.administration.deleteGroup',
        text: this.$translate.instant(
          'telephony_group_admin_actions_group_delete_billing_account',
        ),
      },
      {
        name: 'telephony_group_admin_actions_portabilities',
        sref: 'telecom.telephony.billingAccount.administration.portabilities',
        text: this.$translate.instant(
          'telephony_group_admin_actions_portabilities',
        ),
      },
      {
        name: 'telephony_group_admin_actions_white_label_manager',
        disabled: !this.canResetWhiteLabelManagerPassword,
        sref:
          'telecom.telephony.billingAccount.administration.whiteLabelManager',
        text: this.$translate.instant(
          'telephony_group_admin_actions_white_label_manager',
        ),
      },
    ];
  }
}
