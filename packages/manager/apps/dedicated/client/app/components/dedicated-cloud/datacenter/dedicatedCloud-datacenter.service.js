import filter from 'lodash/filter';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import map from 'lodash/map';

export default class OvhManagerPccDatacenterService {
  /* @ngInject */
  constructor($http, OvhApiMe, icebergUtils) {
    this.OvhApiMe = OvhApiMe;
    this.$http = $http;
    this.icebergUtils = icebergUtils;
  }

  getCommercialRangeName(serviceName, datacenterId) {
    return this.$http
      .get(`/dedicatedCloud/${serviceName}/datacenter/${datacenterId}`)
      .then(({ data }) => data.commercialRangeName);
  }

  fetchConsumptionForAllServices() {
    return this.OvhApiMe.v6().consumption().$promise;
  }

  fetchConsumptionForService(serviceId) {
    return this.fetchConsumptionForAllServices().then(
      OvhManagerPccDatacenterService.keepOnlyConsumptionForService(serviceId),
    );
  }

  static extractElementConsumption({ elements }, { id, type }) {
    return find(
      OvhManagerPccDatacenterService.keepOnlyElementDetailsWithType(
        elements,
        type,
      ),
      OvhManagerPccDatacenterService.keepOnlyElement(id),
    );
  }

  static keepOnlyElementDetailsWithType(elements, type) {
    return flatten(
      map(
        OvhManagerPccDatacenterService.keepOnlyElementsWithType(elements, type),
        'details',
      ),
    );
  }

  static keepOnlyConsumptionForService(serviceId) {
    return (consumptionForAllServices) =>
      find(consumptionForAllServices, { serviceId });
  }

  static keepOnlyElementsWithType(elements, { planFamily }) {
    return filter(elements, { planFamily });
  }

  static keepOnlyElement(id) {
    return (element) => element.uniqueId.split('@')[0] === `${id}`;
  }

  getNsxtEdgeByDatacenter(serviceName, datacenterId, paginationParams) {
    return this.icebergUtils.icebergQuery(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge`,
      paginationParams,
    );
  }

  getConsumptionForecastByServiceId(serviceId) {
    return this.$http
      .get(`/services/${serviceId}/consumption/forecast`)
      .then(({ data }) => data);
  }

  getOrderCatalog(catalog, subsidiary) {
    return this.$http
      .get(`/order/catalog/public/${catalog}?ovhSubsidiary=${subsidiary}`)
      .then(({ data }) => data);
  }

  postRelocateNsxtEdge({ serviceName, datacenterId, nsxtEdgeId, datastore }) {
    return this.$http.post(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge/${nsxtEdgeId}/relocateEdge`,
      {
        datastore,
      },
    );
  }

  addNsxtEdge(serviceName, datacenterId) {
    return this.$http.post(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge`,
    );
  }

  removeNsxtEdge({ serviceName, datacenterId, nsxtEdgeId }) {
    return this.$http.delete(
      `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge/${nsxtEdgeId}`,
    );
  }

  isResilienceModeEnabled({ serviceName, datacenterId, nsxtEdgeId }) {
    return this.$http
      .get(
        `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/nsxtEdge/${nsxtEdgeId}/resilience`,
      )
      .then(({ data }) => data.state === 'enabled');
  }
}
