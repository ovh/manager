import assignIn from 'lodash/assignIn';
import set from 'lodash/set';

export default class IpLoadBalancerHomeService {
  /* @ngInject */
  constructor(
    $injector,
    $q,
    IpLoadBalancerCipherService,
    OvhApiIpLoadBalancing,
    ovhManagerRegionService,
    CucServiceHelper,
  ) {
    this.$injector = $injector;
    this.$q = $q;
    this.IpLoadBalancerCipherService = IpLoadBalancerCipherService;
    this.OvhApiIpLoadBalancing = OvhApiIpLoadBalancing;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.CucServiceHelper = CucServiceHelper;
  }

  getInformations(serviceName) {
    return this.$q
      .all({
        configuration: this.OvhApiIpLoadBalancing.v6().get({ serviceName })
          .$promise,
        failoverIp: this.OvhApiIpLoadBalancing.v6().failoverIp({ serviceName })
          .$promise,
        natIp: this.OvhApiIpLoadBalancing.v6().natIp({ serviceName }).$promise,
      })
      .then((response) => ({
        ipV4: response.configuration.ipLoadbalancing,
        ipV6: response.configuration.ipv6,
        failoverIp: response.failoverIp,
        natIp: response.natIp,
      }))
      .catch(
        this.CucServiceHelper.errorHandler('iplb_information_loading_error'),
      );
  }

  getConfiguration(serviceName) {
    return this.OvhApiIpLoadBalancing.v6()
      .get({ serviceName })
      .$promise.then((response) => {
        response.displayName = response.displayName || response.serviceName;
        response.sslConfiguration = this.IpLoadBalancerCipherService.transformCipher(
          response.sslConfiguration,
        );
        return response;
      })
      .catch(
        this.CucServiceHelper.errorHandler('iplb_configuration_loading_error'),
      );
  }

  getUsage(serviceName) {
    return this.OvhApiIpLoadBalancing.Quota()
      .v6()
      .query({ serviceName })
      .$promise.then((zones) =>
        this.$q.all(
          zones.map((zone) => this.getUsageForZone(serviceName, zone)),
        ),
      )
      .then((quotas) =>
        quotas.map((quota) => {
          set(
            quota,
            'region',
            this.ovhManagerRegionService.getRegion(quota.zone),
          );
          return quota;
        }),
      )
      .catch(this.CucServiceHelper.errorHandler('iplb_usage_loading_error'));
  }

  getUsageForZone(serviceName, zoneName) {
    return this.OvhApiIpLoadBalancing.Quota()
      .v6()
      .get({
        serviceName,
        zoneName,
      }).$promise;
  }

  updateQuota(serviceName, zoneName, alert) {
    return this.OvhApiIpLoadBalancing.Quota()
      .v6()
      .put(
        {
          serviceName,
          zoneName,
        },
        {
          alert,
        },
      )
      .$promise.catch(
        this.CucServiceHelper.errorHandler(
          'iplb_utilisation_update_alert_error',
        ),
      );
  }

  updateName(serviceName, newName) {
    return this.OvhApiIpLoadBalancing.v6()
      .put({ serviceName }, { displayName: newName })
      .$promise.then((response) => {
        this.getConfiguration(serviceName).then((configuration) => {
          if (this.$injector.has('shellClient')) {
            const shellClient = this.$injector.get('shellClient');
            shellClient.ux.updateMenuSidebarItemLabel(
              serviceName,
              configuration.displayName || serviceName,
            );
          }
        });
        return response;
      })
      .catch(
        this.CucServiceHelper.errorHandler(
          'iplb_modal_name_change_updating_error',
        ),
      );
  }

  changeMenuTitle(serviceName, displayName) {
    if (this.$injector.has('shellClient')) {
      const shellClient = this.$injector.get('shellClient');
      shellClient.ux.updateMenuSidebarItemLabel(serviceName, displayName);
    }
  }

  getSubscription(serviceName) {
    return this.$q
      .all({
        configuration: this.OvhApiIpLoadBalancing.v6().get({ serviceName })
          .$promise,
        serviceInfos: this.OvhApiIpLoadBalancing.v6().serviceInfos({
          serviceName,
        }).$promise,
      })
      .then((response) =>
        assignIn(response.serviceInfos, {
          offer: response.configuration.offer,
        }),
      )
      .catch(
        this.CucServiceHelper.errorHandler('iplb_subscription_loading_error'),
      );
  }
}
