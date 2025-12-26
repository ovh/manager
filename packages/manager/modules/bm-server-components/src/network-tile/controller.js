import isFunction from 'lodash/isFunction';
import { filterIpv4List } from './utils';

export default class BmServerComponentsNetworkTileController {
  /* @ngInject */
  constructor($http, $q, atInternet, coreURLBuilder) {
    this.$http = $http;
    this.$q = $q;
    this.atInternet = atInternet;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
    this.totalAssocietedIps = 0;
    this.statePrefix = this.statePrefix || 'app.dedicated-server.server';
    this.hidePublicBandwidth = this.hidePublicBandwidth || false;
    this.manageIpUrl = this.coreURLBuilder.buildURL(
      'dedicated',
      '#/ip?serviceName=:serviceName',
      {
        serviceName: this.server.name,
      },
    );
    this.vrackInfos = [];
    this.loading = true;
    this.loadVrackInfos()
      .then((res) => {
        this.vrackInfos = res;
      })
      .finally(() => {
        this.loading = false;
      });
    this.gameDDosGuide = this.dedicatedServer.gameDDosGuide;
    this.isGameServer = this.dedicatedServer.isGameServer;
    if (this.isGameServer) this.getGameDDoSStatus();
  }

  gameDDoSStatusCodes = {
    noIpConfigured: 'no_ip_configured',
    someIpsConfigured: 'some_ips_configured',
    allIpsConfigured: 'all_ips_configured',
  };

  getGameDDoSStatus() {
    return this.$http
      .get(`/ip?routedTo.serviceName=${encodeURIComponent(this.server.name)}`)
      .catch(() => null)
      .then(({ data = [] }) => {
        this.totalAssocietedIps = data.length;
        const ipv4List = filterIpv4List(data);

        return this.getProtectedGameIpsV4List(ipv4List).then((result = []) => {
          const protectedIpv4Count = result.reduce(
            (sum, curr) => (curr ? sum + 1 : sum),
            0,
          );

          if (!protectedIpv4Count)
            this.gameDDoSStatus = this.gameDDoSStatusCodes.noIpConfigured;
          else if (protectedIpv4Count < result.length)
            this.gameDDoSStatus = this.gameDDoSStatusCodes.someIpsConfigured;
          else this.gameDDoSStatus = this.gameDDoSStatusCodes.allIpsConfigured;
        });
      });
  }

  getProtectedGameIpsV4List(ipv4List) {
    return this.$q.all(
      ipv4List.map((ip) =>
        this.$http
          .get(`/ip/${encodeURIComponent(ip)}/mitigation/${ip.split('/')[0]}`)
          .then(({ data } = {}) => data?.state === 'ok')
          .catch(() => false),
      ),
    );
  }

  loadVrackInfos() {
    return this.getVrack(this.server.name)
      .then((results) => {
        const promises = results.map((vrack) =>
          this.$http.get(`/vrack/${vrack}`).then(({ data }) => ({
            serviceName: vrack,
            ...data,
          })),
        );
        return this.$q.all(promises);
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  getVrack(serviceName) {
    return this.$http
      .get(`/dedicated/server/${serviceName}/vrack`)
      .then((results) => results.data)
      .catch((error) => {
        if (error.status === 404 || error.status === 460) {
          return [];
        }
        return this.$q.reject(error);
      });
  }

  getVrackUrl(vrackId) {
    return this.coreURLBuilder.buildURL('dedicated', '#/vrack/:serviceName', {
      serviceName: vrackId,
    });
  }

  handleError(error) {
    if (isFunction(this.onError)) {
      this.onError({ error });
    }
  }

  canOrderTraffic() {
    return (
      this.dedicatedServerFeatureAvailability?.allowDedicatedServerOrderTrafficOption() &&
      !this.server.isExpired &&
      this.server.canOrderQuota
    );
  }

  canOrderMoreTraffic() {
    return (
      !this.server.isExpired &&
      this.server.canOrderQuota &&
      this.trafficInformation?.trafficOrderables.data.length
    );
  }

  trackClick(trackText) {
    if (this.trackingPrefix) {
      this.atInternet.trackClick({
        name: `${this.trackingPrefix}::${trackText}`,
        type: 'action',
      });
    }
  }
}
