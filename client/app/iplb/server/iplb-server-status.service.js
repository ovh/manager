class IpblServerStatusService {
  static hasIssue(server) {
    return server.probe
      && server.serverState
      && server.serverState.length
      && _.get(_.last(_.sortBy(server.serverState), 'checkTime'), 'status') === 'DOWN';
  }

  static hasNoInfo(server) {
    return !server.probe
      || !server.serverState
      || server.serverState.length === 0
      || _.get(_.last(_.sortBy(server.serverState), 'checkTime'), 'status') === 'no check';
  }

  getStatusIcon(server) {
    if (this.constructor.hasIssue(server)) {
      return 'error';
    }

    if (this.constructor.hasNoInfo(server)) {
      return 'help';
    }

    return 'success';
  }
}

angular.module('managerApp')
  .service('IpblServerStatusService', IpblServerStatusService);
