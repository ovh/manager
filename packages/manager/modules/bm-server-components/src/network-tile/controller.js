import isFunction from 'lodash/isFunction';
import ipaddr from 'ipaddr.js';

const parseIpGameUrl = (ipBlock, ip) =>
  ['/ip', encodeURIComponent(ipBlock), 'game', ip].join('/');

export default class BmServerComponentsNetworkTileController {
  /* @ngInject */
  constructor($http, $q, atInternet, coreURLBuilder) {
    this.$http = $http;
    this.$q = $q;
    this.atInternet = atInternet;
    this.coreURLBuilder = coreURLBuilder;
  }

  $onInit() {
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
    noIpConfigured: {
      text: 'no_ip_configured',
      badge: 'error',
    },
    someIpsConfigured: {
      text: 'some_ips_configured',
      badge: 'warning',
    },
    allIpsConfigured: {
      text: 'all_ips_configured',
      badge: 'success',
    },
  };

  getGameDDoSStatus() {
    return this.$http
      .get(`/ip?routedTo.serviceName=${encodeURIComponent(this.server.name)}`)
      .catch(() => null)
      .then(({ data = [] }) => {
        const ipv4Lists = data.reduce(
          (prev, ipBlock) => {
            const [ip, block] = ipBlock.split('/');

            // filters IPV6
            if (!ipaddr.IPv4.isValid(ip)) return prev;
            // case no sub ip to fetch
            if (!block || block === '32')
              return {
                ...prev,
                withoutSubIP: [
                  ...prev.withoutSubIP,
                  parseIpGameUrl(ipBlock, ip),
                ],
              };
            // case sub ips to fetch
            return {
              ...prev,
              withSubIPs: [
                ...prev.withSubIPs,
                {
                  ipBlock,
                  fetchData: this.$http.get(
                    `/ip/${encodeURIComponent(ipBlock)}/reverse`,
                    { serviceType: 'apiv6' },
                  ),
                },
              ],
            };
          },
          { withoutSubIP: [], withSubIPs: [] },
        );

        return this.getAllGameIpUrls(ipv4Lists).then((allIpGameUrls = []) =>
          this.fetchProtectedGameIpV4List(allIpGameUrls).then((result = []) => {
            this.totalAssocietedIps = result.length;
            const protectedIpv4Count = result.reduce(
              (sum, curr) => (curr ? sum + 1 : sum),
              0,
            );

            if (!protectedIpv4Count)
              this.gameDDoSStatus = this.gameDDoSStatusCodes.noIpConfigured;
            else if (protectedIpv4Count < this.totalAssocietedIps)
              this.gameDDoSStatus = this.gameDDoSStatusCodes.someIpsConfigured;
            else
              this.gameDDoSStatus = this.gameDDoSStatusCodes.allIpsConfigured;
          }),
        );
      });
  }

  getAllGameIpUrls({ withoutSubIP, withSubIPs }) {
    if (!withSubIPs.length) return Promise.resolve(withoutSubIP);
    return this.$q
      .all(
        withSubIPs.map(({ ipBlock, fetchData }) =>
          fetchData.then(({ data }) =>
            data.map((ip) => parseIpGameUrl(ipBlock, ip)),
          ),
        ),
      )
      .then((resp) => [...withoutSubIP, ...resp].flat());
  }

  fetchProtectedGameIpV4List(ipv4List) {
    return this.$q.all(
      ipv4List.map((url) => {
        return this.$http
          .get(url, { serviceType: 'apiv6' })
          .then(
            ({ data: { firewallModeEnabled, state } } = {}) =>
              firewallModeEnabled && state === 'ok',
          )
          .catch(() => false);
      }),
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
