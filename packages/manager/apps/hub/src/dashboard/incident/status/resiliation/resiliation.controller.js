import { buildURL } from '@ovh-ux/ufrontend/url-builder';

export default class {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  resiliate() {
    return this.askForResiliation()
      .then(() =>
        this.goBack(
          this.$translate.instant(
            this.service.isEngaged
              ? 'manager_hub_incident_status_resiliate_success_engaged'
              : 'manager_hub_incident_status_resiliate_success',
            {
              url: buildURL('dedicated', '#/billing/autorenew'),
            },
          ),
        ),
      )
      .catch((error) =>
        this.goBack(
          `${this.$translate.instant(
            'manager_hub_incident_status_resiliate_error',
          )} ${error.data?.message}`,
          'error',
        ),
      );
  }
}
