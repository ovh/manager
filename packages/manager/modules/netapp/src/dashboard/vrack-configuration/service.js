import { VRACK_ORDER_URLS } from './constants';

export default class NetAppVrackConfigurationService {
  /* @ngInject */
  constructor($http, $q, Apiv2Service) {
    this.$http = $http;
    this.$q = $q;
    this.Apiv2Service = Apiv2Service;
    this.VRACK_ORDER_URLS = VRACK_ORDER_URLS;
  }

  filterAllowedVrack(vracks, vrackServicesId) {
    const allowedServicesPromises = [];
    vracks.forEach((vrack) => {
      allowedServicesPromises.push(
        this.getAllowedVrackServices(vrack.internalName).then((data) => ({
          ...data,
          vrack,
        })),
      );
    });

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

  getVrackOrderUrl(subsidiary) {
    return this.VRACK_ORDER_URLS[subsidiary] || this.VRACK_ORDER_URLS.DEFAULT;
  }

  linkVrackToVrackServices(vrackId, vrackServicesId) {
    return this.$http.post(`/vrack/${vrackId}/vrackServices`, {
      vrackServices: vrackServicesId,
    });
  }
}
