class LogsListHeaderCtrl {
  constructor(LogsHelperService) {
    this.LogsHelperService = LogsHelperService;
  }

  $onInit() {
    this.guides = this.LogsHelperService.getGuides();
  }
}

angular
  .module('managerApp')
  .controller('LogsListHeaderCtrl', LogsListHeaderCtrl);
