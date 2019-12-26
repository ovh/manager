angular
  .module('managerApp')
  .controller(
    'DBaasTsSidebarDeleteCtrl',
    (locals, $state, $uibModal, Toast, $translate, OvhApiDBaasTsProject) => {
      function DeleteModalCtrl($uibModalInstance) {
        const self = this;
        self.loaders = {};

        self.confirm = function confirm() {
          self.loaders.deleting = true;

          OvhApiDBaasTsProject.v6()
            .delete({
              serviceName: locals.project.serviceName,
            })
            .$promise.then(
              () => {
                Toast.success(
                  $translate.instant('cloud_project_delete_email_sent'),
                );
                $uibModalInstance.close();
              },
              () => {
                Toast.error($translate.instant('cloud_project_delete_error'));
              },
            )
            .finally(() => {
              self.loaders.deleting = false;
            });
        };

        self.cancel = $uibModalInstance.dismiss;
      }

      $uibModal.open({
        templateUrl: 'app/dbaas/ts/project/delete/dbaasts-project-delete.html',
        controller: DeleteModalCtrl,
        controllerAs: 'DBaasTsProjectDeleteCtrl',
        windowClass: 'cloud_project-delete-modal',
        backdropClass: 'cloud_project-delete-modal-backdrop',
      });
    },
  );
