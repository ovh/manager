import head from 'lodash/head';
import indexOf from 'lodash/indexOf';
import keys from 'lodash/keys';
import pickBy from 'lodash/pickBy';

angular
  .module('managerApp')
  .controller('IpDropdownComponentCtrl', function IpDropdownComponentCtrl(
    $translate,
    $window,
    REDIRECT_URLS,
    OvhApiIp,
    CucCloudMessage,
    CLOUD_GEOLOCALISATION,
  ) {
    const self = this;

    self.failoverAttach = function failoverAttach(ip) {
      self.onFailoverAttach({ ip });
    };

    const ipActionUrlWithSession = REDIRECT_URLS.ipAction;
    self.ipActionRedirections = {
      firewall: ipActionUrlWithSession.replace('{action}', 'firewall'),
      mitigation: ipActionUrlWithSession.replace('{action}', 'mitigation'),
      reverse: ipActionUrlWithSession.replace('{action}', 'reverse'),
    };

    self.ipActionRedirect = function ipActionRedirect(action, ip) {
      let url = null;
      // eslint-disable-next-line no-shadow
      const ipActionUrlWithSession = REDIRECT_URLS.ipAction;
      switch (action) {
        case 'reverse':
          if (self.isIpUserSameContinent(ip)) {
            OvhApiIp.v6().resetCache();
            url = ipActionUrlWithSession
              .replace('{action}', 'reverse')
              .replace(
                '{ipBlock}',
                window.encodeURIComponent(ip.block || ip[self.ipAccessKey]),
              )
              .replace('{ip}', ip[self.ipAccessKey]);
          } else {
            CucCloudMessage.info(
              $translate.instant('cpci_ip_reverse_info_soon'),
            );
          }
          break;
        default:
          url = ipActionUrlWithSession
            .replace('{action}', action)
            .replace(
              '{ipBlock}',
              window.encodeURIComponent(ip.block || ip[self.ipAccessKey]),
            )
            .replace('{ip}', ip[self.ipAccessKey]);
      }
      if (url) {
        $window.open(url);
      }
    };

    self.isIpUserSameContinent = function isIpUserSameContinent(ip) {
      const userContinent = self.getUserContinent();
      const ipContinent = self.getIpContinent(ip);
      return userContinent && ipContinent && userContinent === ipContinent;
    };

    self.getUserContinent = function getUserContinent() {
      let continent = null;
      if (self.user) {
        continent = head(
          keys(
            pickBy(
              CLOUD_GEOLOCALISATION.user,
              (region) => indexOf(region, self.user.ovhSubsidiary) >= 0,
            ),
          ),
        );
      }
      return continent;
    };

    self.getIpContinent = function getIpContinent(ip) {
      let continent = null;
      let linkedVmId;
      switch (ip.type) {
        case 'failover':
          continent = ip.continentCode;
          break;
        case 'public':
          // in case of public IP we get the location from the linked vm
          linkedVmId = head(ip.routedTo);
          if (linkedVmId) {
            const linkedVm = self.infra.vrack.publicCloud.get(linkedVmId);
            if (linkedVm) {
              continent = head(
                keys(
                  pickBy(
                    CLOUD_GEOLOCALISATION.instance,
                    (region) => indexOf(region, linkedVm.region) >= 0,
                  ),
                ),
              );
            }
          }
          break;
        default:
          // unknown type of IP
          break;
      }
      return continent;
    };
  });
