import { DOCUMENTATION_LINK } from './app-command.constants';

export default class {
  /* @ngInject */
  constructor($translate, coreConfig, AppService) {
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.AppService = AppService;
  }

  $onInit() {
    this.loading = false;
    this.command = '';
    const ovhSubsidiary = this.coreConfig.getUser()?.ovhSubsidiary;
    this.documentationLink =
      DOCUMENTATION_LINK[ovhSubsidiary] || DOCUMENTATION_LINK.DEFAULT;
    this.getAppCommandComponent();
  }

  getAppCommandComponent() {
    this.loading = true;
    return this.AppService.getAppCommand(this.projectId, this.appSpecs)
      .then((command) => {
        this.command = command;
      })
      .catch((error) => {
        this.command = this.$translate.instant('pci_app_command_error', {
          message: error.data?.message,
        });
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
