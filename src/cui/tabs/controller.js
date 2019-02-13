export default class cucCuiTabsController {
  /* @ngInject */
  constructor(CuiTabsService) {
    this.CuiTabsService = CuiTabsService;
  }

  $onInit() {
    this.tabs = [];
  }

  addTab(tab) {
    this.CuiTabsService.registerTab(tab);
    this.tabs = this.CuiTabsService.getRegisteredTabs();
  }
}
