export default class BillingCreditsAddController {
  /* @ngInject */
  constructor($translate, atInternet) {
    this.$translate = $translate;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.isAdding = false;
    this.creditCode = null;
  }

  add() {
    this.isAdding = true;
    this.atInternet.trackClick({
      name: 'dedicated::account::billing::payment::credits::add::confirm',
      type: 'action',
    });
    return this.addCreditCode(this.creditCode)
      .then(({ data }) => data)
      .then((result) => {
        this.atInternet.trackPage({
          name: 'dedicated::account::billing::payment::credits::added',
          type: 'navigation',
        });
        return this.goBack(
          this.$translate.instant('voucher_credit_code_success', {
            credit: result.amount.text,
          }),
        );
      })
      .catch((error) =>
        this.goBack(
          `${this.$translate.instant('voucher_credit_code_error')} ${
            error.data?.message
          }`,
          'danger',
        ),
      );
  }
}
