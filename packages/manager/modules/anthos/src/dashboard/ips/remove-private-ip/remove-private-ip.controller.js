export default class RemovePrivateIpController {
  /* @ngInject */
  constructor($translate, Alerter, AnthosTenantsService) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.AnthosTenantsService = AnthosTenantsService;
  }

  removePrivateIp(rangeId) {
    const privateIpIndex = this.privateIPs.findIndex(
      ({ id }) => id === rangeId,
    );
    if (privateIpIndex >= 0) {
      this.privateIPs.splice(privateIpIndex, 1);
    }
  }

  onRemovePrivateIpClick() {
    this.isRemoving = true;

    return this.AnthosTenantsService.removeTenantPrivateIP(
      this.serviceName,
      this.privateIp.id,
    )
      .then(() => {
        this.removePrivateIp(this.privateIp.id);
        return this.goBack(
          this.$translate.instant(
            'anthos_tenant_dashboard_ips_remove_private_ip_modal_action_remove_success',
          ),
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            'anthos_tenant_dashboard_ips_remove_private_ip_modal_action_remove_error',
            {
              message: error.message || error.data?.message,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isRemoving = false;
      });
  }
}
