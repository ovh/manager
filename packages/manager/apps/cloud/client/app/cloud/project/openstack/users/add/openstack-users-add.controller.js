class CloudProjectOpenStackUserAddCtrl {
  constructor(
    $translate,
    $uibModalInstance,
    CucControllerHelper,
    CucCloudMessage,
    OpenstackUsersPassword,
    OvhApiCloud,
    serviceName,
  ) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.OpenstackUsersPassword = OpenstackUsersPassword;
    this.OvhApiCloud = OvhApiCloud;
    this.serviceName = serviceName;

    this.model = {
      value: undefined,
    };
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }

  confirm() {
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.OvhApiCloud.Project()
          .User()
          .v6()
          .save(
            {
              serviceName: this.serviceName,
            },
            {
              description: this.model.value,
            },
          )
          .$promise.then((newUser) => {
            this.OpenstackUsersPassword.put(
              this.serviceName,
              newUser.id,
              newUser.password,
            );
            this.CucCloudMessage.success(
              this.$translate.instant(
                'openstackusers_users_userlist_add_submit_success',
              ),
            );
          })
          .catch((err) =>
            this.CucCloudMessage.error(
              [
                this.$translate.instant(
                  'openstackusers_users_userlist_add_submit_error',
                ),
                (err.data && err.data.message) || '',
              ].join(' '),
            ),
          )
          .finally(() => this.$uibModalInstance.close()),
    });
    return this.saving.load();
  }
}

angular
  .module('managerApp')
  .controller(
    'CloudProjectOpenStackUserAddCtrl',
    CloudProjectOpenStackUserAddCtrl,
  );
