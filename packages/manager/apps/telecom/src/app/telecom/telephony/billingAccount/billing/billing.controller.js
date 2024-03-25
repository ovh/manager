export default /* @ngInject */ function TelecomTelephonyBillingAccountBillingCtrl(
  $translate,
  coreURLBuilder,
) {
  const self = this;

  self.actions = null;

  /*= =====================================
    =            INITIALIZATION            =
    ====================================== */

  function init() {
    self.actions = [
      {
        name: 'group_billing_bill',
        main: true,
        picto: 'ovh-font-receipt',
        sref: 'telecom.telephony.billingAccount.billing.bill',
        text: $translate.instant(
          'telephony_group_billing_actions_group_billing_bill',
        ),
      },
      {
        name: 'group_billing_deposit',
        sref: 'telecom.telephony.billingAccount.billing.deposit',
        text: $translate.instant(
          'telephony_group_billing_actions_group_billing_deposit',
        ),
      },
      {
        name: 'group_billing_deposit_movement',
        sref: 'telecom.telephony.billingAccount.billing.depositMovement',
        text: $translate.instant(
          'telephony_group_billing_actions_group_billing_deposit_movement',
        ),
      },
      {
        name: 'group_billing_credit_threshold',
        sref: 'telecom.telephony.billingAccount.billing.creditThreshold',
        text: $translate.instant(
          'telephony_group_billing_actions_group_billing_credit_threshold',
        ),
      },
      {
        name: 'group_call_list_summary',
        sref: 'telecom.telephony.billingAccount.billing.summary',
        text: $translate.instant(
          'telephony_group_billing_actions_group_call_list_summary',
        ),
      },
      {
        name: 'group_group_called_fees',
        sref: 'telecom.telephony.billingAccount.billing.calledFees',
        text: $translate.instant(
          'telephony_group_billing_actions_group_group_called_fees',
        ),
      },
      {
        name: 'group_called_fees_history',
        sref: 'telecom.telephony.billingAccount.billing.tollfree-history',
        text: $translate.instant(
          'telephony_group_billing_actions_group_called_fees_history',
        ),
      },
      {
        name: 'group_banking_management',
        url: coreURLBuilder.buildURL('dedicated', '#/billing/payment/method'),
        isExternal: true,
        text: $translate.instant(
          'telephony_group_billing_actions_group_banking_management',
        ),
      },
      {
        name: 'group_delayed_account_transfert',
        url: coreURLBuilder.buildURL('dedicated', '#/billing/ovhaccount'),
        isExternal: true,
        text: $translate.instant(
          'telephony_group_billing_actions_group_delayed_account_transfert',
        ),
      },
    ];
  }

  /* -----  End of INITIALIZATION  ------*/

  init();
}
