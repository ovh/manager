import {
  HOST_TYPE,
  ORDER_URL_SUFFIX,
  VDC_TYPE,
} from './dedicatedCloud-vmware-vdc-add.constants';

export default class VmwareVdcAddCtrl {
  /* @ngInject */
  constructor(
    $translate,
    $window,
    coreConfig,
    DedicatedCloud,
    RedirectionService,
    VmwareVdcAddService,
  ) {
    this.$translate = $translate;
    this.$window = $window;
    this.DedicatedCloud = DedicatedCloud;
    this.orderUrlPrefix = RedirectionService.getURL('order');
    this.orderUrlSuffix =
      ORDER_URL_SUFFIX[coreConfig.getUser().ovhSubsidiary] ||
      ORDER_URL_SUFFIX.DEFAULT;
    this.VmwareVdcAddService = VmwareVdcAddService;
    this.VDC_TYPE = VDC_TYPE;
  }

  $onInit() {
    this.vdcList = [];
    this.hostList = [];

    this.model = { vdc: null, host: null, datastoreRequired: false };
  }

  datacentersLoad() {
    this.vdcLoading = true;
    return this.DedicatedCloud.getCommercialRangeCompliance(this.serviceName)
      .then((compliance) => {
        this.vdcList = compliance
          .map((datacenter) => {
            return {
              vdc: datacenter.name,
              translatedName: this.$translate.instant(
                `dedicatedCloud_configuration_add_datacenter_card_vdc_${datacenter.name}_label`,
              ),
            };
          })
          .sort((a, b) => a.translatedName.localeCompare(b.translatedName));
      })
      .catch((err) => {
        return this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_datacenters_adding_load_error',
          )} ${err.message || ''}`,
          'danger',
        );
      })
      .finally(() => {
        this.vdcLoading = false;
      });
  }

  hostsLoad() {
    this.hostsLoading = true;
    return this.checkDatastore()
      .then((data) => {
        const hostType = { ...HOST_TYPE };
        if (!this.orderSapHana) {
          delete hostType.SAPHANA;
        }
        this.model.datastoreRequired = !data;
        this.hostList = Object.values(hostType).map((host) => {
          return {
            name:
              host !== HOST_TYPE.STANDARD
                ? `${this.model.vdc.vdc}_${host}`
                : this.model.vdc.vdc,
            range: this.model.vdc.vdc,
            host,
          };
        });
      })
      .catch((err) => {
        return this.goBack(
          `${this.$translate.instant(
            'dedicatedCloud_datacenters_adding_load_error',
          )} ${err.message || ''}`,
          'danger',
        );
      })
      .finally(() => {
        this.hostsLoading = false;
      });
  }

  checkDatastore() {
    return this.model.vdc.vdc === this.VDC_TYPE.NSX
      ? this.VmwareVdcAddService.canDeployNsxtEdges(this.serviceName)
      : this.VmwareVdcAddService.canDeployVsphere(this.serviceName);
  }

  addDatacenter() {
    this.trackClick(
      `datacenter::add-datacenter::confirm_${this.model.vdc.vdc}`,
    );

    this.submitting = true;

    this.$window.open(
      `${this.orderUrlPrefix}${this.orderUrlSuffix}${JSURL.stringify({
        range: this.model.host.range,
        ...(this.model.host.host !== HOST_TYPE.STANDARD && {
          [this.model.host.host]: true,
        }),
      })}&serviceName=${this.serviceName}${
        this.model.datastoreRequired ? `&datastoreRequired=true` : ''
      }`,
      '_blank',
      'noopener',
    );

    return this.goBack();
  }

  onCancel() {
    this.trackClick('datacenter::add-datacenter::cancel');
    return this.goBack();
  }
}
