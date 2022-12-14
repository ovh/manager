import { MAX_ALLOWED_IP, TRACKING_PREFIX } from './allowed-ips.constant';

export default class AllowedIpsController {
  /* @ngInject */
  constructor($translate, SmsService, TucToast, atInternet) {
    this.$translate = $translate;
    this.smsService = SmsService;
    this.tucToast = TucToast;
    this.atInternet = atInternet;
    this.isOpenModalAddIp = false;
    this.isOpenModalRemoveIp = false;
    this.isSubmitting = false;
    this.modalType = null;
    this.addIp = null;
    this.removeIp = null;
    this.MAX_ALLOWED_IP = MAX_ALLOWED_IP;
    this.TRACKING_PREFIX = TRACKING_PREFIX;
  }

  $onInit() {
    return this.getAllowedIps(this.serviceName);
  }

  openModal(modalType, ip = null) {
    if (modalType === 'add') {
      this.trackClick('add-ip');
      this.isOpenModalAddIp = true;
    } else {
      this.trackClick('delete-ip');
      this.removeIp = ip;
      this.isOpenModalRemoveIp = true;
    }
  }

  closeModal() {
    this.isOpenModalAddIp = false;
    this.isOpenModalRemoveIp = false;
  }

  getAllowedIps() {
    this.isLoading = true;
    return this.smsService
      .getAllowedIps(this.serviceName)
      .then((ips) => {
        this.ips = ips;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  submitAddIp() {
    this.isSubmitting = true;
    this.trackClick('add-ip-confirm');
    return this.smsService
      .putAllowedIps(this.serviceName, { action: 'add', ips: [this.addIp] })
      .then(() => {
        this.tucToast.success(
          this.$translate.instant(
            'sms_options_smpp_parameter_allowed_ips_modal_add_message_success',
          ),
        );
        this.getAllowedIps(this.serviceName);
      })
      .catch(() =>
        this.tucToast.error(
          this.$translate.instant(
            'sms_options_smpp_parameter_allowed_ips_modal_add_message_error',
          ),
        ),
      )
      .finally(() => {
        this.isOpenModalAddIp = false;
        this.isSubmitting = false;
      });
  }

  submitRemoveIp() {
    this.isSubmitting = true;
    this.trackClick('delete-ip-confirm');
    return this.smsService
      .putAllowedIps(this.serviceName, {
        action: 'remove',
        ips: [this.removeIp],
      })
      .then(() => {
        this.tucToast.success(
          this.$translate.instant(
            'sms_options_smpp_parameter_allowed_ips_modal_remove_message_success',
          ),
        );
        this.getAllowedIps(this.serviceName);
      })
      .catch(() =>
        this.tucToast.error(
          this.$translate.instant(
            'sms_options_smpp_parameter_allowed_ips_modal_remove_message_error',
          ),
        ),
      )
      .finally(() => {
        this.isOpenModalRemoveIp = false;
        this.isSubmitting = false;
      });
  }

  trackClick(hit) {
    return this.atInternet.trackClick({
      name: `${TRACKING_PREFIX}${hit}`,
    });
  }
}
