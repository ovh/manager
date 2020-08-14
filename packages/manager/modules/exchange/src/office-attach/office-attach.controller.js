export default class OfficeAttachController {
  /* @ngInject */
  constructor(wucExchange, officeAttach, ovhUserPref, WucUser) {
    this.wucExchange = wucExchange;
    this.officeAttach = officeAttach;
    this.ovhUserPref = ovhUserPref;
    this.WucUser = WucUser;
  }

  $onInit() {
    this.maxNumberOfAccounts = 25;
    this.$routerParams = this.wucExchange.getParams();

    return this.retrievingIfBannerShouldBeDisplayed();
  }

  retrievingIfBannerShouldBeDisplayed() {
    this.canDisplay = false;

    return this.officeAttach
      .retrievingIfPreferencesAllowBannerDisplaying()
      .then((preferencesAllowBannerDisplaying) =>
        preferencesAllowBannerDisplaying
          ? this.officeAttach.retrievingIfUserAlreadyHasSubscribed(
              this.$routerParams.productId,
            )
          : true,
      )
      .then((userHasAlreadySubscribed) => {
        this.canDisplay = !userHasAlreadySubscribed;
      });
  }
}
