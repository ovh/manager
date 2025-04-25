export default class VpsReverseDnsCtrl {
  /* @ngInject */
  constructor($translate, CucCloudMessage, VpsService) {
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.VpsService = VpsService;

    this.loader = {
      init: false,
      save: false,
    };

    this.ips = [];
    this.structuredData = {
      results: [],
    };
    this.model = {
      value: null,
      reverse: null,
    };
  }

  $onInit() {
    this.loader.init = true;
    this.VpsService.getIps(this.serviceName)
      .then((ips) => {
        this.ips = ips;
      })
      .catch((error) =>
        this.CucCloudMessage.error(
          this.$translate.instant('vps_configuration_reversedns_fail', {
            error: error?.data?.message,
          }),
        ),
      )
      .finally(() => {
        this.loader.init = false;
      });
  }

  cancel() {
    return this.goBack();
  }

  confirm() {
    this.loader.save = true;
    this.VpsService.setReversesDns(
      this.serviceName,
      this.model.value.ipAddress,
      this.model.reverse,
    )
      .then(() => {
        this.CucCloudMessage.success(
          this.$translate.instant('vps_configuration_reversedns_success', {
            serviceName: this.serviceName,
          }),
        );
      })
      .catch((error) => {
        this.CucCloudMessage.error(
          this.$translate.instant('vps_configuration_reversedns_fail', {
            error: error?.data?.message,
          }),
        );
      })
      .finally(() => {
        this.loader.save = false;
        this.goBack();
      });
  }
}
