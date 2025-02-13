export default class PciProjectAdditionalIpService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getRegions(projectId, ovhSubsidiary, planCode, addonFamily) {
    const params = { ovhSubsidiary, planCode, addonFamily };

    return this.$http
      .get(`/cloud/project/${projectId}/capabilities/productAvailability`, {
        params,
      })
      .then(({ data: { plans } }) => {
        let regions = [];

        if (planCode) {
          const matchingPlan = plans.find(({ code }) => code === planCode);
          if (matchingPlan) {
            regions = matchingPlan.regions;
          }
        } else if (addonFamily) {
          const filteredPlans = plans.filter(({ code }) =>
            code.includes('hour'),
          );
          regions = filteredPlans.flatMap((plan) => plan.regions);
        }

        return regions.map(({ name, enabled }) => ({
          name,
          enabled,
          hasEnoughQuota: () => true,
        }));
      });
  }

  getPrivateNetworks(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/network/private`)
      .then(({ data }) => data);
  }

  getAssociatedInstance(projectId, regionName) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${regionName}/floatingip`)
      .then(({ data }) => data);
  }

  getNetworkSubnets(projectId, networkId) {
    return this.$http
      .get(`/cloud/project/${projectId}/network/private/${networkId}/subnet`)
      .then(({ data }) => data);
  }

  // TODO use gateway service when available
  getGateways(projectId, regionName) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${regionName}/gateway`)
      .then(({ data }) => data);
  }

  getGatewayDetails(projectId, region, gatewayId) {
    return this.$http
      .get(`/cloud/project/${projectId}/region/${region}/gateway/${gatewayId}`)
      .then(({ data }) => data);
  }

  enableSnatOnGateway(projectId, region, gatewayId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/region/${region}/gateway/${gatewayId}/expose`,
      )
      .then(({ data }) => data);
  }

  getPublicCloudCatalog(params) {
    return this.$http
      .get(`/order/catalog/public/cloud`, {
        params,
      })
      .then(({ data }) => data);
  }

  getIpFailoverFormattedCatalog(params) {
    return this.$http
      .get(`/order/catalog/formatted/ip`, {
        params,
      })
      .then(({ data }) => data);
  }

  createFloatingIp(projectId, regionName, instanceId, ip, gateway = null) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/region/${regionName}/instance/${instanceId}/floatingIp`,
        {
          ip,
          ...(gateway && { gateway }),
        },
      )
      .then(({ data }) => data);
  }

  deleteIpBlock(ipBlock) {
    const [ip, block] = ipBlock.split('/');
    return this.$http.post(
      `/ip/service/${`ip-${block === '32' ? ip : ipBlock}`}/terminate`,
    );
  }

  updateInstanceForFloatingIp(
    projectId,
    ipDetails,
    instanceId,
    floatingIpId,
    ip,
    gateway,
  ) {
    const { region, associatedEntity } = ipDetails;
    const params = {
      floatingIpId,
      ip,
    };
    if (!associatedEntity?.gatewayId && gateway === null) {
      params.gateway = null;
    }
    return this.$http.post(
      `/cloud/project/${projectId}/region/${region}/instance/${instanceId}/associateFloatingIp`,
      params,
    );
  }
}
