export default class IpByoipService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  // Slice
  getAvailableSlicingConfigurations(ip) {
    return this.$http.get(`/ip/${encodeURIComponent(ip)}/bringYourOwnIp/slice`);
  }

  postSliceBYOIP(ip, size) {
    return this.$http.post(
      `/ip/${encodeURIComponent(ip)}/bringYourOwnIp/slice`,
      { slicingSize: size },
    );
  }

  // Aggregate
  getAvailableAggregationConfigurations(ip) {
    return this.$http.get(
      `/ip/${encodeURIComponent(ip)}/bringYourOwnIp/aggregate`,
    );
  }

  postAggregateBYOIP(ip, aggregationIp) {
    return this.$http.post(
      `/ip/${encodeURIComponent(ip)}/bringYourOwnIp/aggregate`,
      { aggregationIp },
    );
  }
}
