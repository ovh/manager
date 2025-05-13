const SPLIT_PAYMENT_ITALY_DECREE_HREF =
  'https://www.gazzettaufficiale.it/atto/serie_generale/caricaArticolo?art.versione=1&art.idGruppo=1&art.flagTipoArticolo=0&art.codiceRedazionale=17A08254&art.idArticolo=3&art.idSottoArticolo=1&art.idSottoArticolo1=10&art.dataPubblicazioneGazzetta=2017-12-05&art.progressivo=0#art';

export default class BillingPaymentMethodSplitPaymentActionCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.DECREE_HREF = SPLIT_PAYMENT_ITALY_DECREE_HREF;
  }

  activateOrDeactivateSplitPayment() {
    this.isActioning = true;

    this.trackClick();

    return this.action()
      .then(() => {
        this.trackPage('validate');
        return this.goBack({
          text: this.$translate.instant(this.successMessageKey),
          type: 'success',
        });
      })
      .catch((error) => {
        this.trackPage('error');
        return this.goBack({
          text: `${this.$translate.instant(this.errorMessageKey)} ${error?.data
            ?.message || ''}`,
          type: 'error',
        });
      })
      .finally(() => {
        this.isActioning = false;
      });
  }
}
