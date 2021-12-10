export default class HostingCdnSharedChangeOfferController {
  onCdnChangeOfferConfirm() {
    this.trackClick('activate_advanced_purge::confirm');

    this.loading = true;
    return this.goToCdnChangeOffer().finally(() => {
      this.loading = false;
    });
  }

  onCdnChangeOfferCancel() {
    this.trackClick('activate_advanced_purge::cancel');

    this.model.options.cache.advanced_purge.enabled = false;
    return this.goBack();
  }
}
