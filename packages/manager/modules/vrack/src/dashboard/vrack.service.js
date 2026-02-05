export default class Vrack {
  /* @ngInject */
  constructor($http, Apiv2Service) {
    this.$http = $http;
    this.Apiv2Service = Apiv2Service;
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

  getOvhCloudConnectServer(serviceName) {
    return this.$http.get(`/ovhCloudConnect/${serviceName}`);
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

  associateOvhCloudConnectToVrack(serviceName, ovhCloudConnectId) {
    return this.$http
      .post(`/vrack/${serviceName}/ovhCloudConnect`, {
        ovhCloudConnect: ovhCloudConnectId,
      })
      .then(({ data }) => data);
  }

  associateVmwareCloudDirectorVirtualDataCenterToVrack(
    serviceName,
    vmwareCloudDirectorVirtualDataCenter,
  ) {
    return this.$http
      .post(`/vrack/${serviceName}/vmwareCloudDirectorVirtualDataCenter`, {
        vmwareCloudDirectorVirtualDataCenter,
      })
      .then(({ data }) => data);
  }

  dissociateOvhCloudConnectFromVrack(serviceName, ovhCloudConnectId) {
    return this.$http
      .delete(`/vrack/${serviceName}/ovhCloudConnect/${ovhCloudConnectId}`)
      .then(({ data }) => data);
  }

  dissociateVmwareCloudDirectorVirtualDataCenterFromVrack(
    serviceName,
    vmwareCloudDirectorVirtualDataCenter,
  ) {
    return this.$http
      .delete(
        `/vrack/${serviceName}/vmwareCloudDirectorVirtualDataCenter/${encodeURIComponent(
          vmwareCloudDirectorVirtualDataCenter,
        )}`,
      )
      .then(({ data }) => data);
  }

  getVrackServices(serviceName) {
    return this.Apiv2Service.httpApiv2({
      method: 'get',
      url: `/engine/api/v2/vrackServices/resource/${serviceName}`,
    });
  }

  addVrackServicesToVrack(vrackId, vrackServicesId) {
    return this.$http.post(`/vrack/${vrackId}/vrackServices`, {
      vrackServices: vrackServicesId,
    });
  }

  deleteVrackServicesFromVrack(vrackId, vrackServicesId) {
    return this.$http.delete(
      `/vrack/${vrackId}/vrackServices/${vrackServicesId}`,
    );
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
