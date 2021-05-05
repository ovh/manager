export default class BannerController {
  /* @ngInject */
  constructor($http, coreConfig) {
    this.$http = $http;
    this.coreConfig = coreConfig;
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
          data.messages[this.coreConfig.getUserLocale()] || data.messages.en_GB,
      }))
      .catch(() => ({
        incident: false,
      }));
  }
}
