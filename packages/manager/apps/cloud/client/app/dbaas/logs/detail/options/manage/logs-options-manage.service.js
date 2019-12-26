class LogsOptionsManageService {
  constructor(
    LogsStreamsService,
    LogsAliasesService,
    LogsIndexService,
    LogsDashboardsService,
    LogsInputsService,
    LogsRolesService,
  ) {
    this.LogsAliasesService = LogsAliasesService;
    this.LogsStreamsService = LogsStreamsService;
    this.LogsIndexService = LogsIndexService;
    this.LogsDashboardsService = LogsDashboardsService;
    this.LogsRolesService = LogsRolesService;
    this.LogsInputsService = LogsInputsService;
  }

  getAllStreams(serviceName) {
    return this.LogsStreamsService.getStreamDetails(serviceName);
  }

  getAllAliases(serviceName) {
    return this.LogsAliasesService.getAliasesDetails(serviceName);
  }

  getAllDashboards(serviceName) {
    return this.LogsDashboardsService.getDashboardsDetails(serviceName);
  }

  getAllIndices(serviceName) {
    return this.LogsIndexService.getIndices(serviceName);
  }

  getAllRoles(serviceName) {
    return this.LogsRolesService.getRoles(serviceName);
  }

  getAllInputs(serviceName) {
    return this.LogsInputsService.getInputs(serviceName);
  }
}

angular
  .module('managerApp')
  .service('LogsOptionsManageService', LogsOptionsManageService);
