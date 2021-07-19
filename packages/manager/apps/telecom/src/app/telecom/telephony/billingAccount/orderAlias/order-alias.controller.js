export default class TelecomTelephonyBillingAccountOrderAliasCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    atInternet,
    TelecomTelephonyBillingAccountOrderAliasService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.atInternet = atInternet;
    this.TelecomTelephonyBillingAccountOrderAliasService = TelecomTelephonyBillingAccountOrderAliasService;
  }

  $onInit() {
    this.loading = { init: false };

    let canOrderSpecialPromise = () => this.$q.when(true);
    if (this.isSvaWalletFeatureAvailable) {
      canOrderSpecialPromise = this.isSvaWalletValid;
    }

    return this.$q
      .all([canOrderSpecialPromise(), this.loadOffers()])
      .then(([canOrderSpecial, offers]) => {
        this.canOrderSpecial = canOrderSpecial;
        this.offers = offers;
      })
      .finally(() => {
        this.loading.init = false;
        this.atInternet.trackPage({
          name: 'orders-PhoneNumb',
          type: 'navigation',
          level2: 'Telecom',
          chapter1: 'telecom',
        });
      });
  }

  loadOffers() {
    return this.TelecomTelephonyBillingAccountOrderAliasService.getUser().then(
      (user) =>
        this.TelecomTelephonyBillingAccountOrderAliasService.getOffers(
          this.$stateParams.billingAccount,
          user.ovhSubsidiary.toLowerCase(),
          {
            range: 'common',
          },
        ),
    );
  }
}
