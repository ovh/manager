export default class HostingCloudWebMigrationController {
  /* @ngInject */
  constructor($translate, Hosting, HostingCloudWebMigrationService) {
    this.$translate = $translate;
    this.Hosting = Hosting;
    this.HostingCloudWebMigrationService = HostingCloudWebMigrationService;
  }

  $onInit() {
    this.isLoading = true;
    this.isSubmitting = false;
    this.errorMessage = null;
    // null = no decision yet (choice screen), true/false = recorded outcome.
    this.recordedDecision = null;

    this.Hosting.getCloudWebMigrationApproval(this.serviceName)
      .then((approval) => {
        this.recordedDecision = approval ? approval.approved : null;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  /**
   * The decision is single-shot: once an approval exists the choice screen is
   * out of reach, whatever the entry point — the banner link stays live for
   * the whole migration.
   */
  submitDecision(approved) {
    if (this.recordedDecision !== null) {
      return null;
    }

    this.trackClick(approved ? 'accept' : 'refuse');
    this.isSubmitting = true;
    this.errorMessage = null;

    return this.HostingCloudWebMigrationService.submitApproval(
      this.serviceName,
      approved,
    )
      .then(() => {
        this.recordedDecision = approved;
      })
      .catch((error) => {
        this.errorMessage = this.$translate.instant(
          'hosting_cloud_web_migration_modal_error',
          { error: error?.data?.message },
        );
      })
      .finally(() => {
        this.isSubmitting = false;
      });
  }

  onAccept() {
    return this.submitDecision(true);
  }

  onRefuse() {
    return this.submitDecision(false);
  }

  /** Closing the choice screen sends nothing; the banner brings the customer back. */
  onDismiss() {
    this.trackClick('dismiss');
    return this.goBack();
  }

  onClose() {
    return this.goBack();
  }
}
