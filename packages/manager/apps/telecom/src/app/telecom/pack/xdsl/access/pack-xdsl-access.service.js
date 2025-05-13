export default class XdslAccessService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getChangeMailTasks(serviceName) {
    return this.$http.get(
      `/xdsl/${serviceName}/tasks?function=changeMailSendingStatus`,
    );
  }

  getAccess(serviceName) {
    return this.$http.get(`/xdsl/${serviceName}`);
  }

  updateMailSending(serviceName, newStatus) {
    return this.$http.post(`/xdsl/${serviceName}/mailSending`, {
      status: newStatus,
    });
  }
}
