import get from 'lodash/get';

export default class OrderHostController {
  /* @ngInject */
  constructor($translate, AnthosTenantsService) {
    this.$translate = $translate;
    this.AnthosTenantsService = AnthosTenantsService;

    this.DISPLAY_NAME_MAX_LENGTH = 255;
  }

  $onInit() {
    this.displayName = this.tenant.name;
  }

  canRenameTenant(renameTenantForm) {
    console.log('ZM:: form', renameTenantForm);
    return (
      !this.isUpdating &&
      this.tenant.name !== this.displayName &&
      renameTenantForm.$valid
    );
  }

  onRenameTenantConfirmClick() {
    // this.trackTenants('dashboard::delete_notebook_confirm');

    this.isUpdating = true;
    return this.AnthosTenantsService.updateTenant(this.tenant.serviceName, {
      name: this.displayName,
    })
      .then(() => {
        return this.goToTenant(
          this.$translate.instant(
            'anthos_tenant_dashboard_general_information_tile_information_description_modal_rename_success',
          ),
        );
      })
      .catch((error) => {
        return this.goBack(
          this.$translate.instant(
            'anthos_tenant_dashboard_general_information_tile_information_description_modal_rename_failed',
            {
              name: this.tenant.name,
              message: get(error, 'data.message'),
            },
          ),
          'error',
        );
      })
      .finally(() => {
        this.isUpdating = false;
      });
  }

  onRenameTenantCancelClick() {
    // this.trackTenants('dashboard::delete_notebook_cancel');
    return this.goBack();
  }
}
