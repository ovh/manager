export default class publicGatewaysServiceClass {
  /* @ngInject */
  constructor($http, Poller) {
    this.$http = $http;
    this.Poller = Poller;
  }

  getGatwayCatalog(params) {
    return this.$http
      .get(`/order/catalog/public/cloud`, {
        params,
      })
      .then(({ data }) => data);
  }

  getAggregatedGateways(projectId) {
    return this.$http
      .get(`/cloud/project/${projectId}/aggregated/gateway`)
      .then(({ data }) =>
        data.resources.map((gateway) => {
          return {
            ...gateway,
            flavour: gateway.model.toUpperCase(),
          };
        }),
      );
  }

  getGateways(serviceName, regionName = 'GRA9') {
    return this.$http
      .get(`/cloud/project/${serviceName}/region/${regionName}/gateway`)
      .then((gateways) =>
        gateways.data.map((gateway) => {
          return {
            ...gateway,
            region: regionName,
          };
        }),
      );
  }

  addGateway(serviceName, region, networkId, subnetId, gateway) {
    const addGatewayNamespace = 'gateway-creation';
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${region}/network/${networkId}/subnet/${subnetId}/gateway`,
        gateway,
      )
      .then(({ data: { id } }) =>
        this.checkOperationStatus(serviceName, id, addGatewayNamespace),
      )
      .then(() =>
        this.Poller.kill({
          namespace: addGatewayNamespace,
        }),
      );
  }

  getPrivateNetworks(serviceName, regionName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/region/${regionName}/network`)
      .then(({ data }) =>
        data.filter((network) => network.visibility === 'private'),
      );
  }

  getSubnet(serviceName, region, networkId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/region/${region}/network/${networkId}/subnet`,
      )
      .then(({ data: subnet }) => subnet);
  }

  getSubnetById(serviceName, regionName, networkId, subnetId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/region/${regionName}/network/${networkId}/subnet/${subnetId}`,
      )
      .then(({ data: subnet }) => subnet);
  }

  createNetworkWithGateway(serviceName, regionName, gateway) {
    const addNetworkGatewayNamespace = 'network-gateway-creation';
    return this.$http
      .post(
        `/cloud/project/${serviceName}/region/${regionName}/network`,
        gateway,
      )
      .then(({ data: { id } }) =>
        this.checkOperationStatus(serviceName, id, addNetworkGatewayNamespace),
      )
      .then(() =>
        this.Poller.kill({
          namespace: addNetworkGatewayNamespace,
        }),
      );
  }

  getRegions(serviceName, params) {
    return this.$http
      .get(`/cloud/project/${serviceName}/capabilities/productAvailability`, {
        params,
      })
      .then(({ data }) => data);
  }

  getRegionsForActivation(serviceName) {
    return this.$http
      .get(`/cloud/project/${serviceName}/regionAvailable`)
      .then(({ data }) => data);
  }

  deleteGateway(serviceName, regionName, gatewayId) {
    const deleteGatewayNamespace = 'gateway-deletion';
    return this.$http
      .delete(
        `/cloud/project/${serviceName}/region/${regionName}/gateway/${gatewayId} `,
      )
      .then(({ data: { id } }) =>
        this.checkOperationStatus(serviceName, id, deleteGatewayNamespace),
      )
      .then(() =>
        this.Poller.kill({
          namespace: deleteGatewayNamespace,
        }),
      );
  }

  fetchGatewayDetails(serviceName, region, gatewayId) {
    return this.$http
      .get(
        `/cloud/project/${serviceName}/region/${region}/gateway/${gatewayId}`,
      )
      .then(({ data }) => data);
  }

  editGateway(serviceName, regionName, gatewayId, params) {
    return this.$http
      .put(
        `/cloud/project/${serviceName}/region/${regionName}/gateway/${gatewayId}`,
        params,
      )
      .then(({ data }) => data);
  }

  enableSnatOnGateway(projectId, region, gatewayId) {
    return this.$http
      .post(
        `/cloud/project/${projectId}/region/${region}/gateway/${gatewayId}/expose`,
      )
      .then(({ data }) => data);
  }

  getSmallestGatewayInfo(ovhSubsidiary) {
    return this.getGatwayCatalog({
      ovhSubsidiary,
      productName: 'cloud',
    }).then((data) => {
      // pick the variants of product with least price
      const gatewayProducts = data.addons
        .filter((addon) => addon.product.startsWith('publiccloud-gateway'))
        .sort(
          (
            { pricings: [{ price: priceA }] },
            { pricings: [{ price: priceB }] },
          ) => priceA - priceB,
        )
        .filter(({ product }, index, arr) => product === arr[0].product);
      const [monthlyPriceObj] = gatewayProducts.find(({ planCode }) =>
        planCode.includes('month'),
      )?.pricings;
      const [hourlyPriceObj] = gatewayProducts.find(({ planCode }) =>
        planCode.includes('hour'),
      )?.pricings;
      return {
        size: gatewayProducts[0].product
          .split('-')
          .slice(-1)
          .join(),
        pricePerMonth: monthlyPriceObj.price,
        pricePerHour: hourlyPriceObj.price,
      };
    });
  }

  checkOperationStatus(serviceName, operationId, namespace) {
    return this.Poller.poll(
      `/cloud/project/${serviceName}/operation/${operationId}`,
      {},
      {
        method: 'get',
        successRule: {
          status: 'completed',
        },
        namespace,
      },
    );
  }
}
