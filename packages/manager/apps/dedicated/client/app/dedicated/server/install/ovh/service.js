import get from 'lodash/get';

import {
  DedicatedServerInstallationTemplate,
  DEDICATED_SERVER_DEFAULT_PARTITION_SCHEME_NAME,
} from '@ovh-ux/manager-models';

export default class DedicatedServerInstallOvh {
  /* @ngInject */
  constructor($http, iceberg) {
    this.$http = $http;
    this.iceberg = iceberg;
  }

  /*= ====================================================
  =            Installation Template Section            =
  ===================================================== */

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
   * @param  {DedicatedServer} server The dedicated server instance to get compatible templates.
   * @return {Promise<Array<DedicatedServerInstallTemplate>>}
   */
  getCompatibleOvhTemplates(server) {
    return this.$http
      .get(`/dedicated/server/${server.name}/install/compatibleTemplates`)
      .then(({ data }) => {
        return this.iceberg('/dedicated/installationTemplate')
          .query()
          .expand('CachedObjectList-Pages')
          .addFilter('templateName', 'in', data.ovh)
          .execute().$promise;
      })
      .then(({ data }) => server.setCompatibleInstallationTemplates(data));
  }

  createInstallationTemplate({ baseTemplateName, defaultLanguage }) {
    const templateName = DedicatedServerInstallationTemplate.getRandomTemplateName();

    return this.$http
      .post('/me/installationTemplate', {
        baseTemplateName,
        defaultLanguage,
        name: templateName,
      })
      .then(() => this.getCustomInstallationTemplate(templateName));
  }

  getCustomInstallationTemplate(templateName) {
    return this.$http
      .get(`/me/installationTemplate/${templateName}`)
      .then(({ data }) => new DedicatedServerInstallationTemplate(data));
  }

  getInstallationTemplateDefaultPartitionScheme(installationTemplate) {
    return this.$http
      .get(
        `/me/installationTemplate/${installationTemplate.templateName}/partitionScheme/${DEDICATED_SERVER_DEFAULT_PARTITION_SCHEME_NAME}`,
      )
      .then(({ data }) =>
        installationTemplate.setDefaultPartitionScheme({
          ...data,
          templateName: installationTemplate.templateName,
        }),
      );
  }

  getInstallationTemplatePartitions(installationPartitionScheme) {
    return this.iceberg(
      `/me/installationTemplate/${installationPartitionScheme.templateName}/partitionScheme/${installationPartitionScheme.name}/partition`,
    )
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) =>
        installationPartitionScheme.addPartitions(data),
      );
  }

  /*= ====  End of Installation Template Section  ====== */

  /**
   * Get the installation raid profile of given server.
   * The raid profile is the result of the call to
   * GET /dedicated/server/{serviceName}/install/hardwareRaidProfile
   *
   * @param  {DedicatedServer} server The dedicated server instance to get hardware raid profile.
   * @return {Promise<Object>}
   */
  getHardwareRaidProfile(server) {
    return this.$http
      .get(`/dedicated/server/${server.name}/install/hardwareRaidProfile`)
      .then(({ data }) => server.hardware.setRaidProfile(data));
  }

  getHardwareSpecifications(server) {
    return this.$http
      .get(`/dedicated/server/${server.name}/specifications/hardware`)
      .then(({ data }) => server.hardware.setSpecifications(data));
  }

  getSshKeys() {
    return this.iceberg('/me/sshKey')
      .query()
      .expand('CachedObjectList-Pages')
      .execute()
      .$promise.then(({ data }) => data);
  }
}
