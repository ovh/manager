export default class BmServerComponentsNetbootService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  setNetBoot(
    serviceName,
    bootId,
    rootDevice = null,
    rescueMail = null,
    rescueSshKey = null,
  ) {
    return this.$http
      .put(`/dedicated/server/${serviceName}`, {
        bootId,
        rootDevice,
        rescueMail,
        rescueSshKey,
      })
      .then(({ data }) => data);
  }

  getRescueMail(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}`)
      .then(({ data }) => data);
  }

  getServerInfos(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}`)
      .then(({ data }) => data);
  }

  getNetboot(serviceName) {
    return this.$http
      .get(`/sws/dedicated/server/${serviceName}/netboot`, {
        serviceType: 'aapi',
      })
      .then(({ data }) => data);
  }
}
