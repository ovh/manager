import { IPV4_BLOCK_REGEX } from './constant';

export default class AssignPrivateIpController {
  /* @ngInject */
  constructor($translate, Alerter, AnthosTenantsService) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.AnthosTenantsService = AnthosTenantsService;

    this.IPV4_BLOCK_REGEX = IPV4_BLOCK_REGEX;
    this.privateIP = {
      range: null,
    };
  }

  onAssignPrivateIpClick() {
    this.isAdding = true;

    return this.AnthosTenantsService.addTenantPrivateIP(
      this.serviceName,
      this.privateIP,
    )
      .then((privateIP) => {
        this.privateIPs.push(privateIP);
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
}
