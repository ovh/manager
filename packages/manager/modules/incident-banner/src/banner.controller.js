import { Environment } from '@ovh-ux/manager-config';

export default class BannerController {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    return this.getIncident().then(({ incident, message }) => {
      this.incident = incident;
      this.message = message;
    });
  }

  getIncident() {
    return this.$http
      .get(`/incident/${this.serviceName}`, {
        serviceType: 'aapi',
      })
      .then(({ data }) => ({
        incident: data.incident,
        message:
          data.messages[Environment.getUserLocale()] || data.messages.en_GB,
      }))
      .catch(() => ({
        incident: false,
      }));
  }
}
