export default class CdaUserAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    $uibModalInstance,
    $stateParams,
    CucCloudMessage,
    OvhApiDedicatedCeph,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.serviceName = $stateParams.serviceName;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiDedicatedCeph = OvhApiDedicatedCeph;

    this.model = {
      userName: null,
    };
    this.options = {
      userName: {
        maxLength: 50,
        pattern: /^[\w]+$/,
      },
    };
    this.saving = false;
    this.messages = [];
    this.messageContainerName = 'cda.dashboard.user.add';
  }

  $onInit() {
    this.loadMessage();
  }

  loadMessage() {
    this.CucCloudMessage.unSubscribe(this.messageContainerName);
    this.messageHandler = this.CucCloudMessage.subscribe(
      this.messageContainerName,
      { onMessage: () => this.refreshMessage() },
    );
  }

  refreshMessage() {
    this.messages = this.messageHandler.getMessages();
  }

  createUser() {
    this.saving = true;
    return this.OvhApiDedicatedCeph.User()
      .v6()
      .post(
        {
          serviceName: this.serviceName,
        },
        {
          userName: this.model.userName,
        },
      )
      .$promise.then((result) => {
        this.$uibModalInstance.close({
          userName: this.model.userName,
          taskId: result.data,
        });
        this.CucCloudMessage.success(
          this.$translate.instant('cda_user_add_success'),
        );
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          `${this.$translate.instant('ceph_common_error')} ${(error.data &&
            error.data.message) ||
            ''}`,
          this.messageContainerName,
        );
      })
      .finally(() => {
        this.saving = false;
      });
  }

  closeModal() {
    this.$uibModalInstance.dismiss();
  }
}
