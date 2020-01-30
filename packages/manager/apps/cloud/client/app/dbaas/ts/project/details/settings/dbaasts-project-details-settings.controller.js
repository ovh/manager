import head from 'lodash/head';

angular
  .module('managerApp')
  .controller(
    'DBaasTsProjectDetailsSettingsCtrl',
    function DBaasTsProjectDetailsSettingsCtrl(
      $q,
      $scope,
      $state,
      $stateParams,
      $rootScope,
      $translate,
      $uibModal,
      Toast,
      OvhApiDBaasTsProject,
      OvhApiDBaasTsRegion,
      Poller,
      SidebarMenu,
    ) {
      // ---------VARIABLE DECLARATION---------

      const self = this;
      const { serviceName } = $stateParams;

      self.loaders = {
        init: false,
      };

      function pollUntilActive(serviceNameParam) {
        Poller.poll(`/dbaas/timeseries/${serviceNameParam}`, null, {
          successRule(project) {
            OvhApiDBaasTsProject.v6().resetCache();
            return project.status === 'ACTIVE';
          },
          namespace: 'dbaas.ts.project.creation',
        }).then(() => {
          // Project ready, go to the main state
          Toast.info($translate.instant('dtpds_project_created'));
          $state.go(
            'dbaas.dbaasts-project.dbaasts-project-details.dbaasts-project-details-key',
          );
        });

        $scope.$on('$destroy', () => {
          Poller.kill({ namespace: 'dbaas.ts.project.creation' });
        });
      }

      function loadProject() {
        return OvhApiDBaasTsProject.v6()
          .get({
            serviceName,
          })
          .$promise.then((project) => {
            self.model = project;

            self.initialConfig =
              !project.regionId || project.regionId.length === 0;
            self.importRunabove = false;
            self.payAsYouGo = project.offerId === 'payg_account';

            self.titleKey = 'dtpds_title';

            switch (project.status) {
              case 'UNCONFIGURED':
                self.titleKey = 'dtpds_title_unconfigured';
                break;
              case 'DELETED':
                // Should not happen, deleted projects aren't displayed
                break;
              case 'ACTIVE':
                // No specific help for active projects
                break;
              case 'CREATION':
                self.titleKey = 'dtpds_title_creation';
                // Transient state that shouldn't last more than 1 minute. Do automatic reloading
                OvhApiDBaasTsProject.v6().resetCache();
                pollUntilActive(serviceName);
                break;
              default:
                break;
            }

            return project;
          });
      }

      // ---------Edit project---------

      self.editProject = function editProject() {
        const project = self.model;

        const config = {
          // serviceName: project.serviceName, // this is the id
          displayName: project.displayName,
        };

        if (self.initialConfig) {
          // Initial configuration
          if (self.importRunabove) {
            config.importRa = true;
            config.raTokenId = project.raTokenId;
            config.raTokenKey = project.raTokenKey;
          } else {
            config.regionId = self.region.id;
          }
        }

        OvhApiDBaasTsProject.v6()
          .setup(
            {
              serviceName,
            },
            config,
          )
          .$promise.then(() => {
            // Refresh sidebar
            const menuItem = SidebarMenu.getItemById(self.model.serviceName);
            if (menuItem) {
              menuItem.title = self.model.displayName;
            }
            Toast.info($translate.instant('dtpds_project_edit_successful'));

            // Reload project
            OvhApiDBaasTsProject.v6().resetCache();
            return loadProject();
          })
          .catch((err) => {
            Toast.error(
              [
                $translate.instant('dtpds_project_edit_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
          })
          .finally(() => {
            self.loader.init = false;
          });
      };

      // ---------INITIALIZATION---------

      function init() {
        self.loaders.init = true;

        // Listen to project events raised by the sidebar when a project is renamed
        // eslint-disable-next-line no-shadow
        $scope.$on('dbaasts-reloadproject', (_, serviceName) => {
          if (serviceName === $stateParams.serviceName) {
            loadProject();
          }
        });

        const futureRegions = OvhApiDBaasTsRegion.v6().query().$promise;
        const futureProject = loadProject();

        return $q
          .all([futureRegions, futureProject])
          .then(
            (values) => {
              self.regions = head(values);

              self.loaders.init = false;

              // Init selected region
              if (self.model.regionId) {
                self.regions.forEach((r) => {
                  if (r.id === self.model.regionId) {
                    self.region = r;
                  }
                });
              }
            },
            (err) => {
              Toast.error(
                [
                  $translate.instant('dtpds_init_loading_error'),
                  (err.data && err.data.message) || '',
                ].join(' '),
              );
            },
          )
          .finally(() => {
            self.loaders.init = false;
          });
      }

      init();
    },
  );
