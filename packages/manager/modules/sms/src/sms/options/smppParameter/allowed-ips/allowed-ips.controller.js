import { MAX_ALLOWED_IP } from './allowed-ips.constant';

export default class AllowedIpsController {
  /* @ngInject */
  constructor($translate, SmsService, TucToast) {
    this.$translate = $translate;
    this.smsService = SmsService;
    this.tucToast = TucToast;
    this.isOpenModalAddIp = false;
    this.isOpenModalRemoveIp = false;
    this.isSubmitting = false;
    this.modalType = null;
    this.addIp = null;
    this.removeIp = null;
    this.MAX_ALLOWED_IP = MAX_ALLOWED_IP;
  }

  $onInit() {
    return this.getAllowedIps(this.serviceName);
  }

  openModal(modalType, ip = null) {
    if (modalType === 'add') {
      this.isOpenModalAddIp = true;
    } else {
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
}
