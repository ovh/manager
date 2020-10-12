export default class LogsListHeaderCtrl {
  /* @ngInject */
  constructor(LogsHelperService) {
    this.LogsHelperService = LogsHelperService;
  }

  $onInit() {
    this.guides = this.LogsHelperService.getGuides(this.me.ovhSubsidiary);
  }
}
