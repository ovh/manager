import JSURL from 'jsurl';
import { PHONE_NUMBER_FOR_TIME2CHAT_REGEX } from '../../telecom-sms.constant';

export default class SmsOrderTime2ChatCtrl {
  /* @ngInject */
  constructor($q, $window, $translate, RedirectionService) {
    this.$q = $q;
    this.$window = $window;
    this.$translate = $translate;
    this.expressOrderUrl = RedirectionService.getURL('expressOrder');
    this.PHONE_NUMBER_FOR_TIME2CHAT_REGEX = PHONE_NUMBER_FOR_TIME2CHAT_REGEX;
  }

  onSubmit() {
    const expressParams = {
      productId: 'sms',
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
          label: 'website',
          value: this.model.website,
        },
        {
          label: 'phonenumber',
          value: this.model.phonenumber,
        },
        {
          label: 'company_name',
          value: this.model.company_name,
        },
        {
          label: 'brand_using_service',
          value: this.model.brand_name,
        },
        {
          label: 'primary_use_case',
          value: this.model.primary_use_case,
        },
        {
          label: 'operational_contact_name',
          value: this.model.operational_contact_name,
        },
        {
          label: 'operational_contact_email',
          value: this.model.operational_contact_email,
        },
      ],
    };
    this.expressOrderUrl = `${this.expressOrderUrl}?products=${JSURL.stringify([
      expressParams,
    ])}`;

    this.$window.open(this.expressOrderUrl, '_blank', 'noopener');
    this.goToDashboard();
  }

  onCancel() {
    this.trackClick(
      `${this.DASHBOARD_TRACKING_PREFIX}::order-time2chat::cancel`,
    );
    return this.goToDashboard();
  }
}
