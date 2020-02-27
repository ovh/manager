import get from 'lodash/get';

import { BillingService } from '@ovh-ux/manager-models';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.editedService = new BillingService(this.service);
  }

  updateContacts() {
    this.isUpdating = true;

    return this.changeContact(this.editedService)
      .then(() =>
        this.goBack(
          this.$translate.instant('account_contacts_service_edit_success'),
        ),
      )
      .catch((error) =>
        this.goBack(
          this.$translate.instant('account_contacts_service_edit_error', {
            message: get(error, 'message'),
          }),
          'danger',
        ),
      );
  }
}
