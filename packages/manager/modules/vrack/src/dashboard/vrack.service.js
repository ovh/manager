export default class Vrack {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  addIpv6(serviceName, ipv6) {
    return this.$http.post(`/vrack/${serviceName}/ipv6`, { block: ipv6 });
  }

  deleteIpv6(serviceName, ipv6) {
    return this.$http.delete(
      `/vrack/${serviceName}/ipv6/${encodeURIComponent(ipv6)}`,
    );
  }

  getIpInfo(ip) {
    return this.$http.get(`/ip/${encodeURIComponent(ip)}`);
  }

  getEligibleServices(serviceName) {
    return this.$http.get(`/vrack/${serviceName}/eligibleServices`);
  }

  getServiceInformation(url, serviceName) {
    return this.$http.get(`${url}/${serviceName}/serviceInfos`);
  }

  getDedicatedServer(serviceName) {
    return this.$http.get(`/dedicated/server/${serviceName}`);
  }

  getDedicatedCloud(serviceName) {
    return this.$http.get(`/dedicatedCloud/${serviceName}`);
  }

  getCloudProject(serviceName) {
    return this.$http.get(`/cloud/project/${serviceName}`);
  }

  getIpLoadbalancing(serviceName) {
    return this.$http.get(`/ipLoadbalancing/${serviceName}`);
  }

  getVrackStatus(vrackId) {
    return this.$http
      .get(`/services?resourceName=${vrackId}`)
      .then(({ data }) => {
        const [serviceId] = data;
        return this.$http.get(`/services/${serviceId}`);
      })
      .then(({ data }) => data?.resource?.state);
  }

  terminateVrack(serviceName) {
    return this.$http.post(`/vrack/${serviceName}/terminate`);
  }
}
