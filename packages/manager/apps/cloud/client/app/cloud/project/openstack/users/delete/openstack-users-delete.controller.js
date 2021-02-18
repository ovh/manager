(() => {
  class CloudProjectOpenStackUserDeleteCtrl {
    constructor($uibModalInstance, serviceName, openstackUser, OvhApiCloud) {
      this.$uibModalInstance = $uibModalInstance;
      this.serviceName = serviceName;
      this.user = openstackUser;
      this.Cloud = OvhApiCloud;

      this.loaders = {
        delete: false,
      };
    }

    deleteUser(userId) {
      return this.Cloud.Project()
        .User()
        .v6()
        .remove({
          serviceName: this.serviceName,
          userId,
        }).$promise;
    }

    confirm() {
      this.loaders.delete = true;
      return this.deleteUser(this.user.id)
        .then(() => this.$uibModalInstance.close())
        .catch((err) => this.$uibModalInstance.dismiss(err))
        .finally(() => {
          this.loaders.delete = false;
        });
    }

    cancel() {
      this.$uibModalInstance.dismiss();
    }
  }

  angular
    .module('managerApp')
    .controller(
      'CloudProjectOpenStackUserDeleteCtrl',
      CloudProjectOpenStackUserDeleteCtrl,
    );
})();
