import { TRACKING_HITS } from './header.constants';

export default class LogsDashboardHeaderCtrl {
  /* @ngInject */
  constructor(LogsDetailService, LogsHelperService) {
    this.LogsDetailService = LogsDetailService;
    this.disableTabs = true;
    this.LogsHelperService = LogsHelperService;
    this.TRACKING_HITS = TRACKING_HITS;
  }

  $onInit() {
    this.initLoaders();
    this.guides = this.LogsHelperService.getGuides(this.me.ovhSubsidiary);
  }

  initLoaders() {
    //  No error handling since we don't want to break anything for a title.
    this.title = this.service.displayName || this.service.serviceName;
    this.disableTabs = this.isAccountDisabled || this.accountSetupRequired;
  }
}
