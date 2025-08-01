import JSURL from 'jsurl';

export default class SmsOrderTime2ChatCtrl {
  /* @ngInject */
  constructor($q, $window, $translate, RedirectionService) {
    this.$q = $q;
    this.$window = $window;
    this.$translate = $translate;
    this.expressOrderUrl = RedirectionService.getURL('expressOrder');
  }

  onSubmit() {
    const expressParams = {
      productId: 'sms',
      // serviceName: this.serviceName,
      planCode: 'sms-time2chat',
      quantity: 1,
      configuration: [
        {
          label: 'sms_account',
          value: this.serviceName,
        },
        {
          label: 'name',
          value: this.model.name,
        },
        {
          label: 'email',
          value: this.model.email,
        },
        {
          label: 'phonenumber',
          value: this.model.phonenumber,
        },
        {
          label: 'region',
          value: 'gra',
        },
      ],
    };
    this.expressOrderUrl = `${this.expressOrderUrl}?products=${JSURL.stringify([
      expressParams,
    ])}`;

    this.$window.open(this.expressOrderUrl, '_blank', 'noopener');
  }

  onCancel() {
    this.trackClick(
      `${this.DASHBOARD_TRACKING_PREFIX}::order-time2chat::cancel`,
    );
    return this.goToDashboard();
  }
}
