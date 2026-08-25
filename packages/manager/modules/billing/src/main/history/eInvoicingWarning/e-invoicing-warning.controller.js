export default class {
  /* @ngInject */
  constructor($window, coreURLBuilder) {
    this.$window = $window;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.siretEditionLink = this.coreURLBuilder.buildURL(
      'account',
      '#/useraccount/infos?fieldToFocus=siretForm',
    );
  }

  // The account form lives in another application: leave the manager behind
  // rather than routing inside billing.
  goToSiretEdition() {
    this.$window.top.location.href = this.siretEditionLink;
  }
}
