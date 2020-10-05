export default class LogsDashboardHeaderCtrl {
  /* @ngInject */
  constructor(
    $stateParams,
    CucControllerHelper,
    LogsDetailService,
    SidebarMenu,
    LogsHelperService,
  ) {
    this.$stateParams = $stateParams;
    this.CucControllerHelper = CucControllerHelper;
    this.LogsDetailService = LogsDetailService;
    this.SidebarMenu = SidebarMenu;
    this.serviceName = $stateParams.serviceName;
    this.disableTabs = true;
    this.LogsHelperService = LogsHelperService;

    this.initLoaders();
  }

  $onInit() {
    this.menuItem = this.SidebarMenu.getItemById(this.serviceName);
    //  If the menu is not yet loaded, we fetch IPLB's displayName.  Dirty patch.
    if (!this.menuItem) {
      this.menuItem = { title: this.serviceName };
    }
    this.runLoaders();
    this.guides = this.LogsHelperService.getGuides();
  }

  initLoaders() {
    //  No error handling since we don't want to break anything for a title.
    this.configuration = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsDetailService.getServiceDetails(this.serviceName),
      successHandler: () => {
        this.title =
          this.configuration.data.displayName ||
          this.configuration.data.serviceName;
        this.disableTabs =
          this.LogsHelperService.isAccountDisabled(this.configuration.data) ||
          this.LogsHelperService.accountSetupRequired(this.configuration.data);
      },
    });
  }

  runLoaders() {
    this.configuration.load();
  }
}
