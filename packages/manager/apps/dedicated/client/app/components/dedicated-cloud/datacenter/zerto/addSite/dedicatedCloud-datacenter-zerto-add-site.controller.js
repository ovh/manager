export default class {
  /* @ngInject */
  constructor(
    $state,
    $timeout,
    $translate,
    Alerter,
    dedicatedCloudZerto,
    Validator,
  ) {
    this.$state = $state;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.dedicatedCloudZerto = dedicatedCloudZerto;
    this.Validator = Validator;
  }

  $onInit() {
    this.isCreating = !this.zertoSite?.id;
    this.ipValidator = {
      test: (ip) => this.Validator.isValidIpv4(ip),
    };

    this.isValidIpv4Block = {
      test: (ip) => this.Validator.isValidIpv4Block(ip),
    };
  }

  validateVpnConfiguration() {
    this.isValidatingVpnConfiguration = true;
    return this.dedicatedCloudZerto
      .addZertoSite(
        {
          serviceName: this.serviceName,
          datacenterId: this.datacenterId,
        },
        this.zertoSite,
      )
      .then(() =>
        this.handleSuccess(
          this.$translate.instant(
            'dedicatedCloud_datacenter_add_site_success_message',
          ),
        ),
      )
      .catch(() => {
        this.Alerter.error(
          this.$translate.instant(
            'dedicatedCloud_datacenter_drp_vpn_error',
            'dedicatedCloudDatacenterZertoAlert',
          ),
          'dedicatedCloud_dashboard_alert',
        );
      })
      .finally(() => {
        this.isValidatingVpnConfiguration = true;
      });
  }
}
