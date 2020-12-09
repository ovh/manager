import find from 'lodash/find';
import head from 'lodash/head';

angular
  .module('managerApp')
  .controller('OpenstackUsersOpenrcCtrl', function OpenstackUsersOpenrcCtrl(
    $httpParamSerializer,
    $stateParams,
    $uibModalInstance,
    CLOUD_OPENRC_VERSION,
    CONFIG_API,
    openstackUser,
    OvhApiCloud,
    OvhApiMe,
    CucRegionService,
    URLS,
  ) {
    const self = this;

    self.regionService = CucRegionService;
    self.openstackUser = openstackUser;
    self.projectId = $stateParams.projectId;

    self.form = {
      regions: [],
    };

    self.data = {
      region: null,
      guideURL: null,
      v3: false,
    };

    self.loaders = {
      regions: false,
      download: false,
      guide: false,
    };

    function initGuideURL() {
      self.loaders.guide = true;
      OvhApiMe.v6()
        .get()
        .$promise.then((me) => {
          const lang = me.ovhSubsidiary;
          self.data.guideURL = URLS.guides.openstack[lang];
        })
        .finally(() => {
          self.loaders.guide = false;
        });
    }

    function getRegions() {
      self.loaders.regions = true;
      return OvhApiCloud.Project()
        .Region()
        .v6()
        .query({
          serviceName: self.projectId,
        })
        .$promise.then((regions) => {
          self.form.regions = regions;
          if (self.form.regions) {
            self.data.region = head(self.form.regions);
          }
        })
        .finally(() => {
          self.loaders.regions = false;
        });
    }

    function init() {
      initGuideURL();
      getRegions();
    }

    function buildOpenrcUrl() {
      let url = [
        (find(CONFIG_API.apis, { serviceType: 'aapi' }) || {}).urlPrefix,
        OvhApiCloud.Project().User().Aapi().services.openrc.url,
        '?',
        $httpParamSerializer({
          region: self.data.region,
          version: self.data.v3
            ? CLOUD_OPENRC_VERSION.V3
            : CLOUD_OPENRC_VERSION.V2,
          download: 1,
        }),
      ].join('');

      const replacements = {
        serviceName: self.projectId,
        userId: openstackUser.id,
      };

      // Build URL
      Object.keys(replacements).forEach((paramName) => {
        url = url.replace(`:${paramName}`, replacements[paramName]);
      });

      return url;
    }

    self.downloadOpenrcFile = function downloadOpenrcFile() {
      const url = buildOpenrcUrl();
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      self.close();
    };

    self.close = function close() {
      $uibModalInstance.close();
    };

    self.cancel = function cancel() {
      $uibModalInstance.dismiss();
    };

    init();
  });
