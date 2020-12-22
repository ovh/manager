import { buildURL } from '@ovh-ux/ufrontend/url-builder';

angular
  .module('managerApp')
  .controller('CloudProjectDetailsCtrl', function CloudProjectDetailsCtrl(
    $stateParams,
    $q,
    $state,
    $rootScope,
    $scope,
    $timeout,
    CucControllerModalHelper,
    OvhApiCloudProject,
    Poller,
    OvhApiMeOrder,
    CucCloudMessage,
    $translate,
    $filter,
  ) {
    const self = this;

    this.projectId = $stateParams.projectId;
    this.project = null;
    this.order = null;

    this.supportUrl = buildURL('dedicated', '#/support');

    self.loaders = {
      cancelCreation: false,
      init: true,
    };

    self.projectDeleteErrorsStatus = {
      expired: 460,
      ok: 401,
    };

    function showExpirationWarningMessage() {
      if (!self.project.expiration) {
        return;
      }

      $rootScope.$broadcast('CloudMainController:refresh');

      CucControllerModalHelper.showWarningModal({
        title: $translate.instant('voucher_warning_title'),
        message: $translate.instant('voucher_warning_description', {
          expiration: $filter('date')(self.project.expiration, 'medium'),
        }),
      });
    }

    /**
     * Poll project creating/deleting
     */
    function pollProject() {
      Poller.poll(`/cloud/project/${self.projectId}`, null, {
        successRule(project) {
          return project.status !== 'creating' && project.status !== 'deleting';
        },
        namespace: 'iaas.pci-project.details',
      }).then(
        // eslint-disable-next-line no-use-before-define
        (project) => handleProjectDetails(project),
        // eslint-disable-next-line consistent-return
        (err) => {
          if (err && err.status) {
            // Error: goTo project creation
            return $state.go('iaas.pci-project-new');
          }
        },
      );
    }

    /**
     * What to do with the API"s return
     */
    function handleProjectDetails(project) {
      self.project = project;

      switch (project.status) {
        case 'ok':
          // If it"s at initialization: go direct to the project,
          // else, it"s during the polling!
          if (!$stateParams.fromProjectAdd) {
            return $state.go('iaas.pci-project.compute', {
              projectId: self.projectId,
            });
          }
          self.loaders.init = false;
          return $timeout(() => {
            showExpirationWarningMessage();
            $rootScope.$broadcast('CloudMainController:refresh');
            return $state.go('iaas.pci-project.compute', {
              projectId: self.projectId,
              createNewVm: $stateParams.createNewVm,
            });
          }, 3000);
        case 'suspended':
          return null;
        case 'creating':
          if (project.orderId) {
            OvhApiMeOrder.v6()
              .get({
                orderId: project.orderId,
              })
              .$promise.then((result) => {
                self.order = result;
              });
          }
          pollProject();
          return null;
        case 'deleting':
          pollProject();
          return null;
        default:
          return null;
      }
    }

    // And kill this polling on exit
    $scope.$on('$destroy', () => {
      Poller.kill({ namespace: 'iaas.pci-project.details' });
    });

    /**
     * INIT: Get project details
     */
    function init() {
      self.loaders.init = true;
      return OvhApiCloudProject.v6()
        .get({
          serviceName: self.projectId,
        })
        .$promise.then((project) => handleProjectDetails(project))
        .catch(() => {
          $state.go('iaas.pci-project-new');
        })
        .finally(() => {
          self.loaders.init = false;
        });
    }

    this.cancelProjectCreation = function cancelProjectCreation() {
      self.loaders.cancelCreation = true;

      return OvhApiCloudProject.v6()
        .cancelCreation(
          {
            serviceName: self.projectId,
          },
          {},
        )
        .$promise.then(
          (result) => {
            CucCloudMessage.success(
              $translate.instant('cpd_project_cancel_success'),
            );
            $rootScope.$broadcast('sidebar_refresh_cloud');
            $state.go('home');
            init();
            return result;
          },
          (err) => {
            switch (err) {
              case self.projectDeleteErrorsStatus.expired:
                CucCloudMessage.error(
                  $translate.instant('cpd_project_cancel_error_expired_status'),
                );
                $rootScope.$broadcast('sidebar_refresh_cloud');
                init();
                break;
              case self.projectDeleteErrorsStatus.ok:
                CucCloudMessage.error(
                  $translate.instant('cpd_project_cancel_error_ok_status'),
                );
                $rootScope.$broadcast('sidebar_refresh_cloud');
                init();
                break;
              default:
                CucCloudMessage.error(
                  $translate.instant('cpd_project_cancel_error'),
                );
            }
            $q.reject(err);
          },
        )
        .finally(() => {
          self.loaders.cancelCreation = false;
        });
    };

    init();
  });
