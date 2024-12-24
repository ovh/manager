export default class PaymentMethodController {
  /* @ngInject */
  constructor($http, coreURLBuilder, $filter, atInternet) {
    this.$http = $http;
    this.coreURLBuilder = coreURLBuilder;
    this.$filter = $filter;
    this.atInternet = atInternet;
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

  trackPaymentClick() {
    this.atInternet.trackClick({
      name: `hub::billing::services::listing::tile::link::${
        this.paymentMehtod ? 'edit' : 'activate'
      }_services::autorenew`,
      type: 'action',
      page_category: this.trackingCategory,
      page: {
        name: this.trackingPage,
      },
    });
  }
}
