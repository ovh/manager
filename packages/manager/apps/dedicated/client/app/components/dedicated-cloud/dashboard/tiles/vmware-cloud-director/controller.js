export default class {
  /* @ngInject */
  constructor($translate, DedicatedCloud, coreURLBuilder) {
    this.$translate = $translate;
    this.DedicatedCloud = DedicatedCloud;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.isSubscribed = false;
    this.guideLink = this.DedicatedCloud.getVCDGuideLink();
    this.messageLink = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/useraccount/emails',
    );
    this.checkSubscription();
  }

  checkSubscription() {
    this.loading = true;
    return this.DedicatedCloud.hasSubscribedVCDOffer(this.productId)
      .then((isSubscribed) => {
        this.isSubscribed = isSubscribed;
        this.subscriptionLabel = this.$translate.instant(
          isSubscribed
            ? 'dedicatedCloud_vmware_cloud_director_subscribed'
            : 'dedicatedCloud_vmware_cloud_director_not_subscribed',
          {
            link: this.guideLink,
          },
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
