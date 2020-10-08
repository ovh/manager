import get from 'lodash/get';

import DedicatedServerRaidController from './components/raid/models/controller';

export default class DedicatedServerInstallOvh {
  /* @ngInject */
  constructor($http, iceberg) {
    this.$http = $http;
    this.iceberg = iceberg;
  }

  getDedicatedInstallTemplateApiSchema() {
    return this.$http
      .get('/dedicated/installationTemplate.json')
      .then(({ data }) => data);
  }

  getTemplatesFamilies() {
    return this.getDedicatedInstallTemplateApiSchema().then((schema) =>
      get(schema, 'models["dedicated.TemplateOsTypeEnum"].enum'),
    );
  }

  /**
   * Get the details of all compatible templates of given server.
   * First call to GET /dedicated/server/{serviceName}/install/compatibleTemplates in order to
   * get the names of compatible templates.
   * Then call GET /dedicated/installationTemplate/{templateName} with Iceberg filter and expand
   * in order to get the details of compatible templates.
   *
   * @param  {string} serviceName The name of the server.
   * @return {Promise<Array<DedicatedServerInstallTemplate>>}
   */
  getCompatibleOvhTemplates(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/install/compatibleTemplates`)
      .then(({ data }) => {
        return this.iceberg('/dedicated/installationTemplate')
          .query()
          .expand('CachedObjectList-Pages')
          .addFilter('templateName', 'in', data.ovh)
          .execute().$promise;
      })
      .then(({ data }) => data);
    // GET /dedicated/server/{serviceName}/install/compatibleTemplates
    // GET /dedicated/installationTemplate/{templateName} with Iceberg
  }

  getHardwareRaidProfiles(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/install/hardwareRaidProfile`)
      .then(({ data }) => {
        const raidProfile = data;
        raidProfile.controllers = raidProfile.controllers.map(
          (raidController) => new DedicatedServerRaidController(raidController),
        );
        return raidProfile;
      });
  }

  getHardwareSpecifications(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/specifications/hardware`)
      .then(({ data }) => data);
  }

  getSshKeys() {
    return this.iceberg('/me/sshKey')
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => data);
  }
}
