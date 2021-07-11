export default class DedicatedServerIpmiService {
  /* @ngInject */
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  canOrderKvm(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/orderable/kvm`)
      .then(({ data }) => data);
  }

  getKvmOrderDurations(serviceName) {
    return this.$http
      .get(`/order/dedicated/server/${serviceName}/kvm`)
      .then(({ data }) => data);
  }

  getKvmOrderDetail(serviceName, duration) {
    return this.$http
      .get(`/order/dedicated/server/${serviceName}/kvm/${duration}`)
      .then(({ data }) => data);
  }

  getKvmOrderDetails(serviceName, durations) {
    return this.$q.all(
      durations.map((duration) =>
        this.getKvmOrderDetail(serviceName, duration),
      ),
    );
  }

  postKvmOrderInfos(serviceName, duration) {
    return this.$http
      .post(`/order/dedicated/server/${serviceName}/kvm/${duration}`)
      .then(({ data }) => data);
  }

  getKvmFeatures(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/features/kvm`)
      .then(({ data }) => data);
  }

  getIpmiFeatures(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/features/ipmi`)
      .then(({ data }) => data)
      .catch((err) => {
        if (err.status === 404) {
          return {
            activated: false,
          };
        }
        return err;
      });
  }

  ipmiStartTest(serviceName, type, ttl) {
    return this.$http
      .post(`/dedicated/server/${serviceName}/features/ipmi/test`, {
        ttl,
        type,
      })
      .then(({ data }) => data);
  }

  ipmiStartConnection({
    serviceName,
    type,
    ttl,
    ipToAllow,
    sshKey,
    withGeolocation,
  }) {
    let promise = this.$q.when(ipToAllow);
    if (withGeolocation) {
      promise = this.getIpGeolocation().then(({ ip }) => ip);
    }
    return promise.then((ip) =>
      this.$http
        .post(`/dedicated/server/${serviceName}/features/ipmi/access`, {
          ttl,
          type,
          sshKey,
          ipToAllow: ip,
        })
        .then(({ data }) => data),
    );
  }

  ipmiGetConnection(serviceName, type) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/features/ipmi/access?type=${type}`)
      .then(({ data }) => data);
  }

  ipmiRestart(serviceName) {
    return this.$http
      .post(`/dedicated/server/${serviceName}/features/ipmi/resetInterface`)
      .then(({ data }) => data);
  }

  ipmiSessionsReset(serviceName) {
    return this.$http
      .post(`/dedicated/server/${serviceName}/features/ipmi/resetSessions`)
      .then(({ data }) => data);
  }

  getIpGeolocation() {
    return this.$http.post('/me/geolocation').then(({ data }) => data);
  }

  getSshKey() {
    return this.$http.get('/me/sshKey').then(({ data }) => data);
  }

  getTaskInProgress(serviceName, type) {
    return this.$http
      .get(`/sws/dedicated/server/${serviceName}/tasks/uncompleted`, {
        serviceType: 'aapi',
        params: {
          type,
        },
      })
      .then(({ data }) => data);
  }
}
