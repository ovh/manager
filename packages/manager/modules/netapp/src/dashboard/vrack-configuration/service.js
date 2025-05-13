export default class NetAppVrackConfigurationService {
  /* @ngInject */
  constructor($http, $q, Apiv2Service) {
    this.$http = $http;
    this.$q = $q;
    this.Apiv2Service = Apiv2Service;
  }

  linkVrackToVrackServices(vrackId, vrackServicesId) {
    return this.$http.post(`/vrack/${vrackId}/vrackServices`, {
      vrackServices: vrackServicesId,
    });
  }
}
