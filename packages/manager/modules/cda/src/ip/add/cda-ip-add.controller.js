export default class CdaIpAddCtrl {
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
      ip: null,
    };
    this.saving = false;
    this.messages = [];
    this.messageContainerName = 'cda.dashboard.ip.add';
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

  createIp() {
    this.saving = true;
    return this.OvhApiDedicatedCeph.Acl()
      .v6()
      .post(
        {
          serviceName: this.serviceName,
        },
        {
          aclList: [this.model.ip],
        },
      )
      .$promise.then((result) => {
        this.$uibModalInstance.close({ taskId: result.data });
        this.CucCloudMessage.success(
          this.$translate.instant('cda_ip_add_success'),
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
