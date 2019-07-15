{
  class officeAttachController {
    constructor(Exchange, officeAttach, ovhUserPref, User) {
      this.Exchange = Exchange;
      this.officeAttach = officeAttach;
      this.ovhUserPref = ovhUserPref;
      this.User = User;
    }

    $onInit() {
      this.maxNumberOfAccounts = 25;
      this.$routerParams = this.Exchange.getParams();

      return this.retrievingIfBannerShouldBeDisplayed();
    }

    retrievingIfBannerShouldBeDisplayed() {
      this.canDisplay = false;

      return this.officeAttach
        .retrievingIfPreferencesAllowBannerDisplaying()
        .then(
          preferencesAllowBannerDisplaying => (preferencesAllowBannerDisplaying
            ? this.officeAttach.retrievingIfUserAlreadyHasSubscribed(this.$routerParams.productId)
            : true),
        )
        .then((userHasAlreadySubscribed) => {
          this.canDisplay = !userHasAlreadySubscribed;
        });
    }
  }

  angular.module('Module.exchange.directives').directive('officeAttach', () => ({
    restrict: 'E',
    templateUrl: 'exchange/office-attach/office-attach.html',
    controller: officeAttachController,
    controllerAs: '$ctrl',
    scope: false,
    replace: true,
  }));
}
