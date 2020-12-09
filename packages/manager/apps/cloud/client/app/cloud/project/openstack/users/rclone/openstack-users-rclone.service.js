import assign from 'lodash/assign';
import find from 'lodash/find';
import map from 'lodash/map';

class CloudProjectOpenstackUsersRcloneService {
  constructor(
    $httpParamSerializer,
    $q,
    CONFIG_API,
    OvhApiCloud,
    CucRegionService,
    CucServiceHelper,
  ) {
    this.$httpParamSerializer = $httpParamSerializer;
    this.$q = $q;
    this.CONFIG_API = CONFIG_API;
    this.OvhApiCloud = OvhApiCloud;
    this.CucRegionService = CucRegionService;
    this.CucServiceHelper = CucServiceHelper;
  }

  getValidRcloneRegions(projectId) {
    return this.OvhApiCloud.Project()
      .Region()
      .v6()
      .query({ serviceName: projectId })
      .$promise.then((regions) =>
        map(regions, (region) => this.CucRegionService.getRegion(region)),
      )
      .catch(
        this.CucServiceHelper.errorHandler('cpou_rclone_modal_loading_error'),
      );
  }

  getRcloneFileInfo(projectId, userId, region) {
    let url = [
      (find(this.CONFIG_API.apis, { serviceType: 'apiv6' }) || {}).urlPrefix,
      this.OvhApiCloud.Project().User().v6().services.rclone.url,
      '?',
      this.$httpParamSerializer({
        region,
      }),
    ].join('');

    const replacements = {
      serviceName: projectId,
      userId,
    };

    Object.keys(replacements).forEach((paramName) => {
      url = url.replace(`:${paramName}`, replacements[paramName]);
    });

    return this.OvhApiCloud.Project()
      .User()
      .v6()
      .rclone({ serviceName: projectId, userId, region }, {})
      .$promise.then((response) => {
        assign(response, { url });
        return response;
      });
  }
}

angular
  .module('managerApp')
  .service(
    'CloudProjectOpenstackUsersRcloneService',
    CloudProjectOpenstackUsersRcloneService,
  );
