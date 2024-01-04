export default class IpByoipService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  // Slice
  getAvailableSlicingConfigurations(ip) {
    return this.$http.get(`/ip/${encodeURIComponent(ip)}/bringYourOwnIp/slice`);
  }

  postSliceBOYIP(ip, size) {
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

  postAggregateBOYIP(ip, aggregationIp) {
    return this.$http.post(
      `/ip/${encodeURIComponent(ip)}/bringYourOwnIp/aggregate`,
      { aggregationIp },
    );
  }
}
