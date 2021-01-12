export default class CdaPoolAddCtrl {
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
      poolName: null,
    };
    this.options = {
      poolName: {
        maxLength: 50,
        pattern: /^[\w]+$/,
      },
    };
    this.saving = false;
    this.messages = [];
    this.messageContainerName = 'cda.dashboard.pool.add';
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

  createPool() {
    this.saving = true;
    return this.OvhApiDedicatedCeph.Pool()
      .v6()
      .post(
        {
          serviceName: this.serviceName,
        },
        {
          poolName: this.model.poolName,
        },
      )
      .$promise.then((result) => {
        this.$uibModalInstance.close({
          poolName: this.model.poolName,
          taskId: result.data,
        });
        this.CucCloudMessage.success(
          this.$translate.instant('cda_pool_add_success'),
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
