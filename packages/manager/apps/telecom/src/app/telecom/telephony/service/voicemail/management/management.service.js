export default class VoicemailManagmentService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getTranscriptURL(billingAccount, serviceName, id) {
    return this.$http
      .get(
        `/telephony/${billingAccount}/voicemail/${serviceName}/directories/${id}/transcript?format=text`,
      )
      .then(({ data }) => data);
  }

  getTranscriptText(url) {
    return this.$http
      .get(url, { responseType: 'text' })
      .then(({ data }) => data)
      .catch((error) => {
        throw error;
      });
  }
}
