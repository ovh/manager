export default /* @ngInject */ function TelecomTelephonyBillingAccountOrderAliasCtrl(
  $q,
  $state,
  $stateParams,
  atInternet,
  TelephonyMediator,
  TelecomTelephonyBillingAccountOrderAliasService,
) {
  this.state = $state.parent;

  const self = this;

  self.loading = {
    init: false,
  };

  function loadOffers() {
    $q.when()
      .then(() => TelecomTelephonyBillingAccountOrderAliasService.getUser())
      .then((user) =>
        TelecomTelephonyBillingAccountOrderAliasService.getOffers(
          $stateParams.billingAccount,
          user.country,
          {
            range: 'common',
          },
        ),
      )
      .then((offerDetails) => {
        self.offers = offerDetails;
        return offerDetails;
      })
      .finally(() => {
        self.loading.init = false;

        atInternet.trackPage({
          name: 'orders-PhoneNumb',
          type: 'navigation',
          level2: 'Telecom',
          chapter1: 'telecom',
        });
      });
  }

  function init() {
    self.loading.init = true;

    loadOffers();
  }

  init();
}
