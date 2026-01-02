export default class TelecomTelephonyBillingAccountOrderProductCtrl {
  /* @ngInject */
  constructor($state, $translate, OvhApiTelephony, OvhApiOrder) {
    this.$translate = $translate;
    this.$state = $state;
    this.OvhApiTelephony = OvhApiTelephony;
    this.OvhApiOrder = OvhApiOrder;

    this.canOrderAlias = false;
  }

  $onInit() {
    this.OvhApiOrder.Telephony()
      .v6()
      .billingAccounts()
      .$promise.then((allowedBillingAccounts) => {
        this.canOrderAlias = allowedBillingAccounts.includes(
          this.billingAccountId,
        );
      });

    this.OvhApiTelephony.Line()
      .v6()
      .query({ billingAccount: this.billingAccountId })
      .$promise.then((lines) => {
        const firstLine = lines[0];
        const accessoryUrl = firstLine
          ? `https://manager.eu.ovhcloud.com/#/telecom/telephony/${this.billingAccountId}/line/${firstLine}/phone/accessories`
          : null;
        this.actions = [
          {
            external: false,
            name: 'link_order_number',
            sref: 'telecom.telephony.billingAccount.orderAlias',
            text: this.$translate.instant('telephony_group_order_number'),
            visible: this.canOrderAlias,
          },
          {
            external: true,
            name: 'link_order_voip',
            href:
              "https://www.ovhtelecom.fr/order/voip/?v=2/#/voip/deals?selection=~(lines~(~(line~'line-sip-fr-individual-fr-0h~country~'fr~numberType~'nogeographic)))",
            text: this.$translate.instant('telephony_group_order_link_voip'),
            target: '_blank',
            visible: true,
          },
          {
            external: true,
            name: 'link_order_sip',
            href: 'https://www.ovhtelecom.fr/telephonie/sip-trunk/',
            text: this.$translate.instant('telephony_group_order_link_sip'),
            target: '_blank',
            visible: true,
          },
          {
            external: true,
            name: 'link_order_accessory',
            href: accessoryUrl,
            text: this.$translate.instant(
              'telephony_group_order_link_accessory',
            ),
            target: '_blank',
            visible: !!accessoryUrl,
          },
        ];
      });
  }
}
