// TODO update when implementing audit logs
export const URL = {
  LOG: '',
  LOG_KIND: '',
  LOG_SUSBSCRIPTION: '',
};

export default class IAMAuditLogsService {
  /* @ngInject */
  constructor($q) {
    this.$q = $q;
  }

  getLogKinds() {
    return this.$q.when(['default']);
  }
}
