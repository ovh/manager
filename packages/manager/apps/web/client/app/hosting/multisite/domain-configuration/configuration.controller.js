import sortBy from 'lodash/sortBy';
import {
  CDN_VALUES,
  FIREWALL_VALUES,
  OWN_LOG_VALUES,
  VALID_PATH,
} from './configuration.constants';

export default class MultisiteDomainConfigurationCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.VALID_PATH = VALID_PATH;
  }

  $onInit() {
    this.isCDNActive = this.cdn === CDN_VALUES.ACTIVE;
    this.isFirewallActive = this.firewall === FIREWALL_VALUES.ACTIVE;
    this.isOwnLogActive = this.ownLog === OWN_LOG_VALUES.ACTIVE;
    this.availableIps = sortBy(
      this.countriesIp.map((ip) => ({
        ...ip,
        translatedCountry: this.$translate.instant(`country_${ip.country}`),
      })),
      ['translatedCountry'],
    );
  }

  onCDNChange(isCDNActive) {
    this.cdn = isCDNActive ? CDN_VALUES.ACTIVE : CDN_VALUES.NONE;
    this.ipv6 = !isCDNActive;
  }

  onFirewallChange(isFirewallActive) {
    this.firewall = isFirewallActive
      ? FIREWALL_VALUES.ACTIVE
      : FIREWALL_VALUES.NONE;
  }

  onOwnLogChange(isOwnLogActive) {
    this.ownLog = isOwnLogActive ? OWN_LOG_VALUES.ACTIVE : OWN_LOG_VALUES.NONE;
  }

  static groupCountries(item) {
    return item.translatedCountry;
  }

  getSortedDomains() {
    return sortBy(this.domains, ['formattedName']);
  }
}
