import { IPV4_REGEX } from './constant';

export default class AssignPrivateIpController {
  /* @ngInject */
  constructor($translate, Alerter, AnthosTenantsService) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.AnthosTenantsService = AnthosTenantsService;

    this.ipModel = {
      form: null,
      labels: {
        privateInputIp: 'privateInputIp',
      },
      validationKeys: {
        INVALID_IP_FORMAT: 'INVALID_IP_FORMAT',
        INVALID_PRIVATE_IP: 'INVALID_PRIVATE_IP',
        INVALID_RANGE_IP: 'INVALID_RANGE_IP',
      },
      privateIp: {
        range: null,
      },
    };
  }

  static isValidV4Ip(ip) {
    return IPV4_REGEX.IP_V4_FORMAT.test(ip);
  }

  static isValidCidrIp(range) {
    return IPV4_REGEX.IP_CIDR_V4_FORMAT.test(range);
  }

  static isValidRangeIp(range) {
    const [rangeStart, rangeEnd] = (range || '').split('-');
    return (
      AssignPrivateIpController.isValidV4Ip(rangeStart) &&
      AssignPrivateIpController.isValidV4Ip(rangeEnd)
    );
  }

  static isPrivateIp(ips) {
    return (
      ips.findIndex((ip) => {
        return (
          IPV4_REGEX.PRIVATE.RANGE_V4_10.test(ip) ||
          IPV4_REGEX.PRIVATE.RANGE_V4_172.test(ip) ||
          IPV4_REGEX.PRIVATE.RANGE_V4_192.test(ip)
        );
      }) >= 0
    );
  }

  static isValidIpFormat(range) {
    return (
      AssignPrivateIpController.isValidV4Ip(range) ||
      AssignPrivateIpController.isValidCidrIp(range) ||
      AssignPrivateIpController.isValidRangeIp(range)
    );
  }

  isValidIp() {
    const { form, labels, validationKeys, privateIp } = this.ipModel;
    const { range } = privateIp;
    const [ip] = (range || '').split('/');
    const [rangeStart, rangeEnd] = (range || '').split('-');
    const { INVALID_IP_FORMAT, INVALID_PRIVATE_IP } = validationKeys;

    Object.keys(this.ipModel.validationKeys).forEach((validationKey) => {
      form[labels.privateInputIp].$setValidity(validationKey, true);
    });

    if (!AssignPrivateIpController.isValidIpFormat(range)) {
      form[labels.privateInputIp].$setValidity(INVALID_IP_FORMAT, false);
      return false;
    }

    if (
      !AssignPrivateIpController.isPrivateIp([range, ip, rangeStart, rangeEnd])
    ) {
      form[labels.privateInputIp].$setValidity(INVALID_PRIVATE_IP, false);
      return false;
    }

    return true;
  }

  assignPrivateIp() {
    this.isAdding = true;

    return this.AnthosTenantsService.addTenantPrivateIP(
      this.serviceName,
      this.ipModel.privateIp,
    )
      .then((privateIp) => {
        this.privateIPs.push(privateIp);
        return this.goBack(
          this.$translate.instant(
            'anthos_tenant_dashboard_component_assign_private_ip_modal_action_add_success',
          ),
          'success',
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            'anthos_tenant_dashboard_component_assign_private_ip_modal_action_add_error',
            {
              message: error.message || error.data?.message,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isAdding = false;
      });
  }

  onAssignPrivateIpCancel() {
    this.trackClick(`${this.assignPrivateIpHitTracking}::cancel`);

    return this.goBack();
  }

  onAssignPrivateIpSubmit() {
    this.trackClick(`${this.assignPrivateIpHitTracking}::confirm`);

    if (this.isValidIp()) {
      return this.assignPrivateIp();
    }

    return null;
  }
}
