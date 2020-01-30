angular
  .module('managerApp')
  .controller(
    'CloudProjectRenameController',
    function CloudProjectRenameController(
      $rootScope,
      $q,
      $translate,
      $uibModal,
      CucCloudMessage,
      OvhApiCloudProject,
      SidebarMenu,
    ) {
      const self = this;

      self.loader = {
        save: false,
      };

      self.editing = {
        description: null,
      };

      self.model = {
        description: null,
      };

      function getProjectDescription() {
        OvhApiCloudProject.v6()
          .get({
            serviceName: self.projectId,
          })
          .$promise.then((data) => {
            self.model.description = data.description;
          })
          .catch((err) => {
            CucCloudMessage.error(
              [
                $translate.instant('cloud_project_rename_loading_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
          });
      }

      self.$onInit = function $onInit() {
        self.editing.description = null;
        getProjectDescription();
      };

      self.saveDescription = function saveDescription() {
        self.loader.save = true;

        OvhApiCloudProject.v6()
          .put(
            {
              serviceName: self.projectId,
            },
            {
              description: self.editing.description || '',
            },
          )
          .$promise.then(() => {
            self.model.description = self.editing.description;
            const menuItem = SidebarMenu.getItemById(self.projectId);
            if (menuItem) {
              menuItem.title = self.editing.description;
            }
          })
          .catch((err) => {
            CucCloudMessage.error(
              [
                $translate.instant('cloud_project_rename_error'),
                (err.data && err.data.message) || '',
              ].join(' '),
            );
          })
          .finally(() => {
            self.loader.save = false;
            self.editing.description = null;
          });
      };

      self.watchForEscapeKey = function watchForEscapeKey($event) {
        if ($event.keyCode === 27) {
          // escape key code
          self.editing.description = null;
        }
      };
    },
  );
