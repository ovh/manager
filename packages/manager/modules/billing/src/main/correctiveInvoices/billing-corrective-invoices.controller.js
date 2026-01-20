export default /* @ngInject */ function BillingCorrectiveInvoicesController(
  $window,
  BillingCorrectiveInvoices,
) {
  this.$onInit = () => {
    this.loading = true;
    this.hasError = false;
    this.correctiveInvoices = [];

    BillingCorrectiveInvoices.getCorrectiveInvoices()
      .then((data) => {
        this.correctiveInvoices = data;
      })
      .catch(() => {
        this.hasError = true;
      })
      .finally(() => {
        this.loading = false;
      });
  };

  this.downloadInvoice = (url) => {
    $window.open(url);
  };
}
