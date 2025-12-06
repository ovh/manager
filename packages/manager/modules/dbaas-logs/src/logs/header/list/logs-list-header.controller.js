export default class LogsListHeaderCtrl {
  /* @ngInject */
  constructor(LogsHelperService, constants) {
    this.LogsHelperService = LogsHelperService;
    this.constants = constants;
  }

  $onInit() {
    this.guides = this.LogsHelperService.getGuides();
  }
}
