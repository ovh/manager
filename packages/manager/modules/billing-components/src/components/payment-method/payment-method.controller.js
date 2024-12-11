export default class PaymentMethodController {
  /* @ngInject */
  constructor($http, coreURLBuilder, $filter) {
    this.$http = $http;
    this.coreURLBuilder = coreURLBuilder;
    this.$filter = $filter;
  }

  $onInit() {
    this.$http
      .get(`/me/payment/method`, {
        serviceType: 'apiv6',
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
        },
      })
      .then((reponse) => {
        this.paymentMehtod = reponse.data.find((item) => item.default);
        if (!this.paymentMehtod) return;

        const expireDate = this.paymentMehtod.expirationDate;

        this.formatedExpirationDate = expireDate
          ? this.$filter('date')(expireDate, 'MM/yyyy')
          : '-';

        this.isExpiredCard =
          expireDate && new Date(expireDate).getTime() < Date.now();
        this.icon =
          this.paymentMehtod.icon?.url || this.paymentMehtod.icon?.data;
      });

    this.updatePaymentMethodLink = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/billing/payment/method',
    );
  }
}
