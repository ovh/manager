import head from 'lodash/head';
import indexOf from 'lodash/indexOf';
import keys from 'lodash/keys';
import pickBy from 'lodash/pickBy';

import { buildURL, buildURLs } from '@ovh-ux/ufrontend/url-builder';

angular
  .module('managerApp')
  .controller('IpDropdownComponentCtrl', function IpDropdownComponentCtrl(
    $translate,
    $window,
    OvhApiIp,
    CucCloudMessage,
    CLOUD_GEOLOCALISATION,
  ) {
    const self = this;

    self.failoverAttach = function failoverAttach(ip) {
      self.onFailoverAttach({ ip });
    };

    self.ipActionRedirections = buildURLs({
      firewall: {
        application: 'dedicated',
        path: '#/configuration/ip',
        params: { action: 'firewall' },
      },
      mitigation: {
        application: 'dedicated',
        path: '#/configuration/ip',
        params: { action: 'mitigation' },
      },
      reverse: {
        application: 'dedicated',
        path: '#/configuration/ip',
        params: { action: 'reverse' },
      },
    });

    self.ipActionRedirect = function ipActionRedirect(action, ip) {
      let url = null;
      switch (action) {
        case 'reverse':
          if (self.isIpUserSameContinent(ip)) {
            OvhApiIp.v6().resetCache();

            url = buildURL('dedicated', '#/configuration/ip', {
              action: 'reverse',
              ip: ip[self.ipAccessKey],
              ipBlock: ip.block || ip[self.ipAccessKey],
            });
          } else {
            CucCloudMessage.info(
              $translate.instant('cpci_ip_reverse_info_soon'),
            );
          }
          break;
        default:
          url = buildURL('dedicated', '#/configuration/ip', {
            action,
            ip: ip[self.ipAccessKey],
            ipBlock: ip.block || ip[self.ipAccessKey],
          });
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
