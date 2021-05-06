import get from 'lodash/get';

import { IPV4_BLOCK_PATTERN } from './allowed-ip.constants';

export default class {
  /* @ngInject */
  constructor($translate, DatabaseService) {
    this.$translate = $translate;
    this.DatabaseService = DatabaseService;
    this.IPV4_BLOCK_PATTERN = IPV4_BLOCK_PATTERN;
  }

  $onInit() {
    this.isLoading = false;
    this.ipData = {
      ip: '',
      description: '',
    };
    Object.assign(this.ipData, this.allowedIp);
  }

  isIpAllowed(ip) {
    return !(this.existingIps && ip)
      ? true
      : !this.existingIps.includes(this.constructor.formatIpMask(ip));
  }

  static formatIpMask(ipBlock) {
    const [ip, mask] = ipBlock.split('/');
    return `${ip}/${mask || '32'}`;
  }

  processIp() {
    this.trackDatabases(
      this.allowedIp
        ? 'dashboard::allowed-ips::options::update_ips_confirm'
        : 'dashboard::allowed-ips::add_ips_confirm',
    );
    this.isLoading = true;
    return (this.allowedIp
      ? this.DatabaseService.editRestrictedIp(
          this.projectId,
          this.database.engine,
          this.database.id,
          this.ipData.ip,
          this.ipData.description,
        )
      : this.DatabaseService.addRestrictedIp(
          this.projectId,
          this.database.engine,
          this.database.id,
          this.constructor.formatIpMask(this.ipData.ip),
          this.ipData.description,
        )
    )
      .then(() => {
        this.trackDatabases(
          this.allowedIp
            ? 'dashboard::allowed-ips::options::update_ips_validate'
            : 'dashboard::allowed-ips::add_ips_validate',
        );
        return this.goBack(
          this.$translate.instant(
            this.allowedIp
              ? 'pci_database_allowed_ip_update_success'
              : 'pci_database_allowed_ip_add_success',
          ),
        );
      })
      .catch((error) => {
        this.trackDatabases(
          this.allowedIp
            ? 'dashboard::allowed-ips::options::update_ips_error'
            : 'dashboard::allowed-ips::add_ips_error',
        );
        this.goBack(
          this.$translate.instant(
            this.allowedIp
              ? 'pci_database_allowed_ip_update_error'
              : 'pci_database_allowed_ip_add_error',
            {
              message: get(error, 'data.message'),
            },
          ),
          'error',
        );
      });
  }

  cancel() {
    this.trackDatabases(
      this.allowedIp
        ? 'dashboard::allowed-ips::options::update_ips_cancel'
        : 'dashboard::allowed-ips::add_ips_cancel',
    );
    this.goBack();
  }
}
