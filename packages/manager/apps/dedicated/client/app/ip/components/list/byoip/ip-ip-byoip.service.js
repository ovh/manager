export default class IpByoipService {
  /* @ngInject */
  constructor($http) {
    this.$http = $http;
  }

  getAvailableSlicingConfigurations(ip) {
    return this.$http.get(`/ip/${encodeURIComponent(ip)}/bringYourOwnIp/slice`);
  }

  postSliceBOYIP(ip, size) {
    return this.$http.post(
      `/ip/${encodeURIComponent(ip)}/bringYourOwnIp/slice`,
      { slicingSize: size },
    );
  }
}
