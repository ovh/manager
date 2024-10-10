import get from 'lodash/get';
import last from 'lodash/last';
import sortBy from 'lodash/sortBy';

export default class IpblServerStatusService {
  static hasIssue(server) {
    return (
      server.probe &&
      server.serverState &&
      server.serverState.length &&
      get(last(sortBy(server.serverState), 'checkTime'), 'status') === 'DOWN'
    );
  }

  static hasNoInfo(server) {
    return (
      !server.probe ||
      !server.serverState ||
      server.serverState.length === 0 ||
      get(last(sortBy(server.serverState), 'checkTime'), 'status') ===
        'no check'
    );
  }

  getStatusIcon(server) {
    if (this.constructor.hasIssue(server)) {
      return 'error';
    }

    if (this.constructor.hasNoInfo(server)) {
      return 'N/A';
    }

    return 'success';
  }
}
