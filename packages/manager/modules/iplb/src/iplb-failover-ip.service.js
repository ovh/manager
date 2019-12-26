export default class IpLoadBalancerFailoverIpService {
  /* @ngInject */
  constructor($translate, OvhApiIpLoadBalancing, CucServiceHelper) {
    this.$translate = $translate;
    this.IpLoadBalancing = OvhApiIpLoadBalancing;
    this.CucServiceHelper = CucServiceHelper;
  }

  getFailoverIps(serviceName) {
    return this.IpLoadBalancing.v6()
      .failoverIp({ serviceName })
      .$promise.then((response) => response)
      .catch(
        this.CucServiceHelper.errorHandler(
          'iplb_failover_ip_detail_loading_error',
        ),
      );
  }

  getFailoverIpsSelectData(serviceName) {
    return this.getFailoverIps(serviceName)
      .then((ipfos) =>
        ipfos.map((ipfo) => ({
          id: ipfo,
          name: ipfo,
        })),
      )
      .then((ipfos) => {
        ipfos.unshift({
          id: 0,
          name: this.$translate.instant('iplb_ipfo_select_placeholder'),
        });

        return ipfos;
      });
  }
}
