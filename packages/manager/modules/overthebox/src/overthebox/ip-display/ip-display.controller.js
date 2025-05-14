import OVERTHEBOX_DETAILS_IP_DISPLAY from './ip-display.constant';

export default class Ipv6DisplayCtrl {
  isIpv4 = false;

  isIpv6 = false;

  $onInit() {
    this.isIpv4 = this.ip.version === OVERTHEBOX_DETAILS_IP_DISPLAY.ip.v4;
    this.isIpv6 = this.ip.version === OVERTHEBOX_DETAILS_IP_DISPLAY.ip.v6;
  }

  formatIp() {
    return `${this.ip.ip} / ${this.ip.range}`;
  }

  loaderLabelClass() {
    return this.isIpv6Enabled
      ? 'overthebox-ip-display_ip-activation_from-disabled'
      : 'overthebox-ip-display_ip-activation_from-enabled';
  }

  onIpv6ActivationChange(modelValue) {
    this.onIpActivationUpdate({
      isIpEnabled: modelValue,
    });
  }
}
