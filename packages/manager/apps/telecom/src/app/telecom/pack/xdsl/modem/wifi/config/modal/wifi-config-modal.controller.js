export default class XdslModemWifiConfigModalCtrl {
  /* @ngInject */
  constructor($http, $translate, $stateParams, TucToast) {
    this.$http = $http;
    this.$translate = $translate;
    this.$stateParams = $stateParams;
    this.TucToast = TucToast;
  }

  $onInit() {
    this.getQRcode();
  }

  getQRcode() {
    // Retrieve QR code from APIv6
    this.$http
      .get(
        `apiv6/xdsl/${this.$stateParams.serviceName}/modem/wifi/${this.wifiName}/qrCode`,
      )
      .then((response) => {
        // Display modal with the QR code retrieved from APIv6
        const qrcode = response.data;
        this.qrcode = qrcode ? `data:image/png;base64, ${qrcode}` : '';
      })
      .catch((error) => {
        if (error.status === 403) {
          // Display modal with message to inform the customer where to find QR code on modem side
          this.message = this.$translate.instant(
            'xdsl_modem_wifi_config_modal_modem_qrcode',
          );
        } else {
          // Display error
          this.TucToast.error(
            this.$translate.instant('xdsl_modem_wifi_read_error'),
          );
        }
      });
  }
}
