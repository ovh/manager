import { TRACKING_HITS } from './header.constants';

export default class LogsDashboardHeaderCtrl {
  /* @ngInject */
  constructor(LogsDetailService, LogsHelperService, constants) {
    this.LogsDetailService = LogsDetailService;
    this.disableTabs = true;
    this.LogsHelperService = LogsHelperService;
    this.TRACKING_HITS = TRACKING_HITS;
    this.constants = constants;
  }

  $onInit() {
    this.initLoaders();
    this.guides = this.LogsHelperService.getGuides();
    this.LogsDetailService.getServiceDetails(this.serviceName).then(
      (service) => {
        this.iamEnabled = service.isIamEnabled;
      },
    );
  }

  initLoaders() {
    //  No error handling since we don't want to break anything for a title.
    this.title = this.service.displayName || this.service.serviceName;
    this.disableTabs = this.isAccountDisabled || this.accountSetupRequired;
  }
}
