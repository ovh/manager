export default class OctaviaLoadBalancerInstanceService {
  /* @ngInject */
  constructor($http, $translate, Alerter) {
    this.$http = $http;
    this.$translate = $translate;
    this.Alerter = Alerter;
  }

  getRegionInstances(projectId, regionName) {
    return this.$http
      .get(`/cloud/project/${projectId}/instance?region=${regionName}`)
      .then(({ data }) =>
        data.map((instance) => {
          const ipv4Addresses = instance.ipAddresses.filter(
            (ip) => ip.version === 4,
          );
          const ipAddress =
            ipv4Addresses.find((ip) => ip.type === 'private') ||
            ipv4Addresses.find((ip) => ip.type === 'public');
          return {
            id: instance.id,
            name: instance.name,
            displayName: `${instance.name} (${ipAddress.ip})`,
            ipAddress,
          };
        }),
      )
      .catch((error) => {
        this.Alerter.error(
          this.$translate.instant('octavia_load_balancer_global_error', {
            message: error.data.message,
            requestId: error.config.headers['X-OVH-MANAGER-REQUEST-ID'],
          }),
          'octavia.alerts.global',
        );
        throw error;
      });
  }
}
