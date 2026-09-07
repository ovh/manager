import { CLOUD_WEB_MIGRATION_BLOCKED_BEFORE } from './cloud-web-migration.constants';

/**
 * Outcome of a recorded approval: 'approved', 'refused', 'blocked', or null
 * when the customer has not answered. A refusal recorded before the cutoff
 * was written by the platform for a service that cannot be migrated, so it
 * gets its own wording — the customer never refused anything.
 * The API serves UTC, and the comparison is on absolute milliseconds.
 */
function getOutcome(approval) {
  if (!approval) return null;
  if (approval.approved) return 'approved';

  return Date.parse(approval.createdAt) <=
    Date.parse(CLOUD_WEB_MIGRATION_BLOCKED_BEFORE)
    ? 'blocked'
    : 'refused';
}

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
    // null = no decision yet (choice screen), otherwise the recorded outcome.
    this.outcome = null;

    this.Hosting.getCloudWebMigrationApproval(this.serviceName)
      .then((approval) => {
        this.outcome = getOutcome(approval);
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
    if (this.outcome !== null) {
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
        // A refusal just submitted is by definition after the cutoff, so it
        // can only be the customer's own decision.
        this.outcome = approved ? 'approved' : 'refused';
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

  /**
   * Translation key for one slot of the refusal screen. Both outcomes share
   * the refund and data-retrieval paragraphs, so only these three slots are
   * resolved per outcome — the `cause` slot is the first sentence, whose
   * refused wording lives under `confirmation`.
   * @param {'title'|'cause'|'shutdown'} slot
   */
  refusedKey(slot) {
    const prefix = 'hosting_cloud_web_migration_modal_';
    if (this.outcome === 'blocked') {
      return `${prefix}blocked_${slot}`;
    }

    const refusedSlots = {
      title: 'title',
      cause: 'confirmation',
      shutdown: 'shutdown',
    };
    return `${prefix}refused_${refusedSlots[slot]}`;
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
