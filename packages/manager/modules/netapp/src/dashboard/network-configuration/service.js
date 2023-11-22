export default class NetAppNetworkConfigurationService {
  /* @ngInject */
  constructor(Apiv2Service) {
    this.Apiv2Service = Apiv2Service;
  }

  getVrackServices() {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: '/engine/api/v2/vrack-services/resource',
    });
  }
}
