export default class HostingCdnSharedChangeOfferController {
  onCdnChangeOfferConfirm() {
    this.trackClick('activate_advanced_purge::upgrade_confirm');

    this.loading = true;
    return this.goToCdnChangeOffer().finally(() => {
      this.loading = false;
    });
  }

  onCdnChangeOfferCancel() {
    this.trackClick('activate_advanced_purge::upgrade_error');

    this.model.options.cache.advanced_purge.enabled = false;
    return this.goBack();
  }
}
