import {
  isAnycastDns,
  isDedicatedDns,
  isInternalDns,
} from '../dns-modify/components/add-dns-forms/add-dns-form/add-dns-form.constants';
import {
  NS_UPDATE_RESULT,
  STATUS,
} from '../dns-modify/domain-dns-modify.constants';
import { DNS_STATUS, DNS_TYPE } from './domain-dns.constants';

export default class DomainDnsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $q,
    $stateParams,
    Domain,
    WucUser,
    WucValidator,
    constants,
    goToDnsAnycast,
    goToTerminateAnycast,
    goToDnsModify,
    currentSection,
  ) {
    this.$scope = $scope;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.Domain = Domain;
    this.WucUser = WucUser;
    this.WucValidator = WucValidator;
    this.constants = constants;
    this.goToDnsAnycast = goToDnsAnycast;
    this.goToTerminateAnycast = goToTerminateAnycast;
    this.goToDnsModify = goToDnsModify;
    this.currentSection = currentSection;
  }

  $onInit() {
    this.allowModification = false;
    this.dns = {
      original: null,
      nameServers: [],
      isAnycastSubscribed: false,
      isUpdatingNameServers: false,
    };
    this.isLoading = true;
    this.urls = {
      zoneCheck: this.constants.urls.TOOLS.ZONE_CHECK,
    };
    this.nsUpdateStatus = this.$stateParams.nsUpdateStatus;

    this.constants.DNS_STATUS = DNS_STATUS;
    this.constants.DNS_TYPE = DNS_TYPE;
    this.constants.NS_UPDATE_RESULT = NS_UPDATE_RESULT;

    this.$scope.$on('Domain.Dns.Reload', () => this.init());
    this.$scope.getDns = () => this.getDns();

    this.init();
  }

  init() {
    const promises =
      this.currentSection === 'domain'
        ? [this.getDomain(), this.hasAnycast(), this.getDns()]
        : [this.getDns()];
    return this.$q
      .all(promises)
      .then(([domain, hasAnycast]) => {
        this.domain = domain;
        if (this.currentSection === 'domain') {
          this.dns.isAnycastSubscribed = hasAnycast;
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  getDomain() {
    return this.Domain.getSelected(this.$stateParams.productId);
  }

  getDns() {
    if (this.currentSection === 'domain') {
      return this.Domain.getResource(this.$stateParams.productId).then(
        (resource) => {
          const current = resource.currentState.dnsConfiguration.nameServers;
          const target = resource.targetSpec.dnsConfiguration.nameServers;

          function isIncluded(dns, search) {
            return dns.some(
              (x) =>
                x.nameServer === search.nameServer &&
                x.ipv4 === search.ipv4 &&
                x.ipv6 === search.ipv6,
            );
          }

          function transform(dns, status) {
            const type = dns.nameServerType
              ? DNS_TYPE[dns.nameServerType] ?? DNS_TYPE.STANDARD
              : DomainDnsCtrl.guessNameserverType(dns.nameServer);

            return {
              name: dns.nameServer,
              ip: dns.ipv4 || dns.ipv6 || '',
              status,
              type,
            };
          }

          //
          // The name servers statuses should be computed from the resource targetSpec
          // and currentState, just as in the following example:
          // ------------------------------------------------------------------
          // CurrentState     TargetSpec          Status
          // ------------------------------------------------------------------
          // ns1.toto.fr      ns1.toto.fr         - ns1.toto.fr      Enabled
          // ns2.toto.fr      ns2.toto.fr         - ns2.toto.fr      Enabled
          // ------------------------------------------------------------------
          // ns1.toto.fr      dns111.ovh.net      - ns1.toto.fr      Deleting
          // ns2.toto.fr      dns111.ovh.net      - ns2.toto.fr      Deleting
          //                                      - dns111.ovh.net   Activating
          //                                      - ns111.ovh.net    Activating
          // ------------------------------------------------------------------
          // ns1.toto.fr      ns1.toto.fr         - ns1.toto.fr      Enabled
          // ns2.toto.fr      ns3.toto.fr         - ns2.toto.fr      Deleting
          //                                      - ns3.toto.fr      Activating
          // ------------------------------------------------------------------
          // ns1.toto.fr      []                  - ns1.toto.fr      Deleting
          // ns2.toto.fr                          - ns2.toto.fr      Deleting
          // ------------------------------------------------------------------
          const activated = current
            .filter((x) => isIncluded(target, x))
            .map((x) => transform(x, DNS_STATUS.ACTIVATED));
          const adding = target
            .filter((x) => !isIncluded(current, x))
            .map((x) => transform(x, DNS_STATUS.ADDING));
          const deleting = current
            .filter((x) => !isIncluded(target, x))
            .map((x) => transform(x, DNS_STATUS.DELETING));

          this.dns.nameServers.push(...activated, ...adding, ...deleting);

          // Check if there is a pending update of the name servers
          this.dns.isUpdatingNameServers =
            adding.length >= 1 || deleting.length >= 1;
        },
      );
    }

    return this.Domain.getZoneByZoneName(this.$stateParams.productId).then(
      (zoneInfos) => {
        function transform(dns) {
          return {
            name: dns,
            type: DomainDnsCtrl.guessNameserverType(dns),
          };
        }
        this.dns.isAnycastSubscribed = zoneInfos.hasDnsAnycast;
        this.dns.nameServers = zoneInfos.nameServers.map((x) => transform(x));
      },
    );
  }

  static guessNameserverType(ns) {
    if (isAnycastDns(ns)) {
      return DNS_TYPE.ANYCAST;
    }
    if (isDedicatedDns(ns)) {
      return DNS_TYPE.DEDICATED;
    }
    if (isInternalDns(ns)) {
      return DNS_TYPE.STANDARD;
    }
    return DNS_TYPE.EXTERNAL;
  }

  async hasAnycast() {
    return this.Domain.getDnsAnycast(this.$stateParams.productId)
      .then((data) => data?.status === STATUS.ENABLED.toLowerCase())
      .catch(() => false);
  }

  get isDnssecEnable() {
    return this.domain.dnssecStatus === STATUS.ENABLED;
  }

  checkPendingPropagation(dnsServers) {
    this.displayPropagationInfo = dnsServers.some(
      (server) => server.toDelete || !server.isUsed,
    );
  }
}
