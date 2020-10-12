export default class LogsDashboardHeaderCtrl {
  /* @ngInject */
  constructor(LogsDetailService, SidebarMenu, LogsHelperService) {
    this.LogsDetailService = LogsDetailService;
    this.SidebarMenu = SidebarMenu;
    this.disableTabs = true;
    this.LogsHelperService = LogsHelperService;
  }

  $onInit() {
    this.initLoaders();
    this.menuItem = this.SidebarMenu.getItemById(this.serviceName);
    //  If the menu is not yet loaded, we fetch IPLB's displayName.  Dirty patch.
    if (!this.menuItem) {
      this.menuItem = { title: this.serviceName };
    }
    this.guides = this.LogsHelperService.getGuides(this.me.ovhSubsidiary);
  }

  initLoaders() {
    //  No error handling since we don't want to break anything for a title.
    this.title = this.service.displayName || this.service.serviceName;
    this.disableTabs = this.isAccountDisabled || this.accountSetupRequired;
  }
}
