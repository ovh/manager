import { BillingService } from '@ovh-ux/manager-models';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.editedService = new BillingService(this.service);
    this.shouldReplicateContact = true;
  }

  updateContacts() {
    this.isUpdating = true;

    const promises = [this.changeContact(this.editedService)];

    if (this.relatedReplicableService && this.shouldReplicateContact) {
      const relatedUpdatedService = new BillingService({
        ...this.relatedReplicableService,
        contactBilling: this.editedService.contactBilling,
        contactTech: this.editedService.contactTech,
        contactAdmin: this.editedService.contactAdmin,
      });
      promises.push(this.changeContact(relatedUpdatedService));
    }

    return Promise.all(promises)
      .then(() =>
        this.goBack(
          this.$translate.instant('account_contacts_service_edit_success'),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('account_contacts_service_edit_error', {
            message: error?.message,
          }),
          'danger',
        ),
      );
  }

  getReplicableServiceTranslationType() {
    return this.$translate.instant(
      `account_contacts_service_edit_replicate_type_${this.relatedReplicableService.category}`,
    );
  }
}
