export default class CdaDetailEditCtrl {
  /* @ngInject */
  constructor(
    $uibModalInstance,
    $translate,
    $stateParams,
    CucCloudMessage,
    CdaService,
    items,
  ) {
    this.$uibModalInstance = $uibModalInstance;
    this.$translate = $translate;
    this.serviceName = $stateParams.serviceName;
    this.CucCloudMessage = CucCloudMessage;
    this.CdaService = CdaService;
    this.items = items;
    this.messageContainerName = 'cda.dashboard.detail.edit';

    this.model = {
      label: items.details.label,
      crushTunable: items.details.crushTunables,
    };
    this.options = {
      label: {
        maxLength: 25,
      },
    };
    this.crushTunableValues = items.crushTunablesOptions;
    this.saving = false;
    this.messages = [];
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

  editCluster() {
    this.CucCloudMessage.flushMessages(this.messageContainerName);
    this.saving = true;
    return this.CdaService.updateDetails(
      this.serviceName,
      this.model.label,
      this.model.crushTunable,
    )
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('cda_detail_edit_success'),
        );
        this.$uibModalInstance.close();
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
