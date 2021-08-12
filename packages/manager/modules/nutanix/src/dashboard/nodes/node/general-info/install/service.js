import get from 'lodash/get';

export default class NutanixNodeInstallService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getDedicatedInstallTemplateApiSchema() {
    return this.$http.get('/dedicated/server.json').then(({ data }) => data);
  }

  getDedicatedTemplateEnum(enumName) {
    return this.getDedicatedInstallTemplateApiSchema().then((schema) =>
      get(schema, `models["${enumName}"].enum`),
    );
  }

  /**
   * Get the hardware specifications of given dedicated server.
   * The hardware specifications is the result of the call to
   * GET /dedicated/server/{serviceName}/specifications/hardware
   *
   * @param  {DedicatedServer} server The dedicated server instance to get hardware raid profile.
   * @return {Promise<DedicatedServerHardwareSpecifications>}
   */
  getHardwareSpecifications(server) {
    return this.$http
      .get(`/dedicated/server/${server.name}/specifications/hardware`)
      .then(({ data }) => server.hardware.setSpecifications(data));
  }
}
