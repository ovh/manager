export default class NetAppVrackConfigurationService {
  /* @ngInject */
  constructor($http, $q, Apiv2Service) {
    this.$http = $http;
    this.$q = $q;
    this.Apiv2Service = Apiv2Service;
  }

  filterAllowedVrack(vracks, vrackServicesId) {
    const allowedServicesPromises = vracks.map((vrack) =>
      this.getAllowedVrackServices(vrack.internalName).then((data) => ({
        ...data,
        vrack,
      })),
    );

    return this.$q
      .all(allowedServicesPromises)
      .then((data) =>
        data
          .filter((vrackAllowedServices) =>
            vrackAllowedServices.vrackServices.includes(vrackServicesId),
          )
          .map((availableVrack) => ({ ...availableVrack.vrack })),
      );
  }

  getAllowedVrackServices(vrackId) {
    return this.$http
      .get(`/vrack/${vrackId}/allowedServices?serviceFamily=vrackServices`)
      .then(({ data }) => data);
  }

  linkVrackToVrackServices(vrackId, vrackServicesId) {
    return this.$http.post(`/vrack/${vrackId}/vrackServices`, {
      vrackServices: vrackServicesId,
    });
  }
}
