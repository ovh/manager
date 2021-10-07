export default class RenameServiceController {
  /* @ngInject */
  constructor($translate, AnthosTenantsService) {
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;

    this.TENANT_NAME_MAX_LENGTH = 255;
  }

  $onInit() {
    this.tenantName = this.tenant.name;
  }

  canRenameTenant(renameTenantForm) {
    return (
      !this.isUpdating &&
      this.tenantName !== this.tenant.name &&
      renameTenantForm.$valid
    );
  }

  onRenameTenantConfirmClick() {
    this.isUpdating = true;

    return this.AnthosTenantsService.updateTenant(this.tenant.serviceName, {
      name: this.tenantName,
    })
      .then((tenant) => {
        this.tenant.update(tenant);

        return this.goToTenant(
          this.$translate.instant(
            'anthos_tenant_dashboard_general_information_tile_information_name_modal_rename_success',
          ),
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            'anthos_tenant_dashboard_general_information_tile_information_name_modal_rename_failed',
            {
              name: this.tenant.name,
              message: error.message || error.data?.message,
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isUpdating = false;
      });
  }
}
