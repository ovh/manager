import assign from 'lodash/assign';
import get from 'lodash/get';

{
  function WebSiteConfigurationController(
    $scope,
    $q,
    $location,
    $timeout,
    $translate,
    Hosting,
    Domain,
    HostingDomain,
    HostingDatabase,
    HostingModule,
    Alerter,
  ) {
    const self = this;
    let errorLoad = false;
    const moduleIdEnum = {
      blog: 229,
      shop: 230,
    };

    self.loading = {
      init: false,
      capabilities: false,
    };
    self.alerts = 'website.configuration';
    self.site = {
      config: {
        domain: $location.search() ? $location.search().domain : null,
        type: 'classic',
        module: {},
      },
    };

    function init() {
      self.loading.init = true;

      $q.all([Domain.getDomains(), Hosting.getHostings(), Hosting.getModels()])
        .then((data) => {
          ['domains', 'hostings', 'hostingModels'].forEach((val, index) => {
            self[val] = data[index];
          });
        })
        .finally(() => {
          self.loading.init = false;
        });
    }

    self.isPasswordValid = Hosting.constructor.isPasswordValid;

    self.loadHosting = (serviceName) => {
      self.loading.capabilities = true;
      self.error = false;
      self.site.config.module = {};

      $q.all({
        info: Hosting.getHosting(serviceName),
        capabilities: HostingDatabase.getDatabasesCapabilities(serviceName),
      })
        .then((response) => {
          const databaseCapabilites = response.capabilities.database.reduce(
            (prev, database) => prev || !!database.available,
            false,
          );
          const privateDatabaseCapabilities = response.capabilities.privateDatabase.reduce(
            (prev, privateDatabase) => prev || !!privateDatabase.available,
            false,
          );
          self.hostingInfos = response.info;

          self.canBeCreated =
            databaseCapabilites || privateDatabaseCapabilities;
          const haveEnoughRemaining =
            Hosting.constructor.getRemainingQuota(
              self.hostingInfos.quotaSize,
              self.hostingInfos.quotaUsed,
            ) >= 219;
          self.canBeCreated = self.canBeCreated && haveEnoughRemaining;
        })
        .catch((err) => {
          Alerter.alertFromSWS(
            $translate.instant('website_hosting_capabilities_error'),
            err,
            self.alerts,
          );
          self.canBeCreated = false;
          self.hostingInfos = null;
          self.error = true;
        })
        .finally(() => {
          self.loading.capabilities = false;
        });
    };

    self.checkConfiguration = () => {
      let moduleConfiguration = true;
      if (self.site.config.type !== 'classic') {
        moduleConfiguration = ['adminName', 'adminPassword', 'language'].reduce(
          (prev, current) => prev && self.site.config.module[current] != null,
          true,
        );
      }

      return (
        self.site.config.domain &&
        self.site.config.hosting &&
        self.site.config.type &&
        moduleConfiguration
      );
    };

    self.checkWebsiteConfiguration = () =>
      self.site.config.type !== 'classic' &&
      (self.site.config.module.adminPasswordConfirm !==
        self.site.config.module.adminPassword ||
        !self.isPasswordValid(self.site.config.module.adminPassword));

    function createModule() {
      const data = assign({}, self.site.config.module);

      data.moduleId = moduleIdEnum[self.site.config.type];
      delete data.adminPasswordConfirm;

      return HostingModule.createModule(self.site.config.hosting, data);
    }

    self.createWebSite = () => {
      const path =
        self.site.config.type === 'classic'
          ? './www'
          : `./${self.site.config.domain}`;
      const promises = [
        HostingDomain.addDomain(
          self.site.config.domain,
          '',
          path,
          true,
          true,
          true,
          'none',
          null,
          'none',
          false,
          false,
          null,
          self.site.config.hosting,
        ),
      ];
      errorLoad = false;

      if (self.site.config.type !== 'classic') {
        promises.push(createModule());
      }

      self.loading.init = true;
      $q.all(promises)
        .then(
          () => {
            $location.url(
              [
                '/website/configuration',
                self.site.config.domain,
                self.site.config.hosting,
                'success',
                self.site.config.type,
              ].join('/'),
            );
          },
          (err) => {
            let traduction = 'website_creation_error';
            errorLoad = true;
            if (err.data) {
              traduction =
                err.data.split(':')[0] === '402'
                  ? 'website_creation_error_quotas'
                  : 'website_creation_error';
            }

            Alerter.alertFromSWS(
              $translate.instant(traduction),
              { message: get(err, 'data', err.message), type: 'ERROR' },
              self.alerts,
            );
          },
        )
        .finally(() => {
          self.site.config = {
            domain: null,
            type: 'classic',
            module: {},
          };
          self.loading.init = false;
        });
    };

    $scope.$on('hostingDomain.modifyDomain.done', () => {
      if (!errorLoad) {
        Alerter.success(
          $translate.instant('website_creation_success_done'),
          self.alerts,
        );
      }
    });

    $scope.$on('hostingDomain.modifyDomain.error', (err) => {
      if (!errorLoad) {
        Alerter.alertFromSWS(
          $translate.instant('website_creation_error'),
          get(err, 'data', err),
          self.alerts,
        );
      }
    });

    $scope.resetAction = () => $scope.setAction(false);

    $scope.setAction = (action, data) => {
      $scope.currentAction = action;
      $scope.currentActionData = data;

      if (action) {
        $scope.stepPath = `views/configuration/hosting/actions/${$scope.currentAction}.html`;
        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        $scope.currentActionData = null;
        $timeout(() => {
          $scope.stepPath = '';
        }, 300);
      }
    };

    init();
  }

  angular
    .module('App')
    .controller('WebSiteConfigurationCtrl', [
      '$scope',
      '$q',
      '$location',
      '$timeout',
      '$translate',
      'Hosting',
      'Domain',
      'HostingDomain',
      'HostingDatabase',
      'HostingModule',
      'Alerter',
      WebSiteConfigurationController,
    ]);
}
