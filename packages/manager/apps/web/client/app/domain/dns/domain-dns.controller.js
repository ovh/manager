import { DNS_STATUS } from './domain-dns.constants';

export default class DomainDnsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $filter,
    $q,
    $stateParams,
    $translate,
    Alerter,
    Domain,
    WucUser,
    WucValidator,
    constants,
    goToDnsAnycast,
    goToTerminateAnycast,
    goToDnsModify,
  ) {
    this.$scope = $scope;
    this.$filter = $filter;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Domain = Domain;
    this.WucUser = WucUser;
    this.WucValidator = WucValidator;
    this.constants = constants;
    this.goToDnsAnycast = goToDnsAnycast;
    this.goToTerminateAnycast = goToTerminateAnycast;
    this.goToDnsModify = goToDnsModify;
  }

  $onInit() {
    this.allowModification = false;
    this.dns = {
      original: null,
      nameServers: [],
      isAnycastSubscribed: false,
      isUpdatingNameServers: false,
    };
    this.loading = {
      all: true,
      nameServers: false,
    };
    this.urls = {
      zoneCheck: this.constants.urls.TOOLS.ZONE_CHECK,
    };
    this.isSuccess = this.$stateParams.isSuccess;

    this.constants.DNS_STATUS = DNS_STATUS;

    this.$scope.$on('Domain.Dns.Reload', () => this.init());
    this.$scope.getDns = () => this.getDns();

    this.$q
      .all({
        serviceInfo: this.Domain.getServiceInfo(this.$stateParams.productId),
        user: this.WucUser.getUser(),
      })
      .then(({ serviceInfo, user }) => {
        this.allowModification =
          serviceInfo &&
          user &&
          (serviceInfo.contactTech === user.nichandle ||
            serviceInfo.contactAdmin === user.nichandle);
      });

    this.init();
  }

  init() {
    return this.Domain.getSelected(this.$stateParams.productId)
      .then((domain) => {
        this.domain = domain;
        this.getDns();
        this.hasAnycast();
      })
      .finally(() => {
        this.loading.all = false;
      });
  }

  getDns() {
    this.loading.nameServers = true;

    return this.Domain.getResource(this.$stateParams.productId).then(
      (resource) => {
        const {
          nameServers: current = [],
        } = resource.currentState?.dnsConfiguration;

        const {
          nameServers: target = [],
        } = resource.targetSpec?.dnsConfiguration;

        function isIncluded(dns, search) {
          return dns.some(
            (x) =>
              x.nameServer === search.nameServer &&
              x.ipv4 === search.ipv4 &&
              x.ipv6 === search.ipv6,
          );
        }

        function transform(dns, status) {
          return {
            name: dns.nameServer,
            ip: dns.ipv4 || dns.ipv6 || '',
            status,
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

  async hasAnycast() {
    return this.Domain.getDnsAnycast(this.$stateParams.productId)
      .then((data) => data?.status === 'enabled')
      .catch(() => false)
      .then((hasAnycast) => {
        this.dns.isAnycastSubscribed = hasAnycast;
      });
  }

  get isDnssecEnable() {
    return this.domain.dnssecStatus === 'ENABLED';
  }

  checkPendingPropagation(dnsServers) {
    this.displayPropagationInfo = dnsServers.some(
      (server) => server.toDelete || !server.isUsed,
    );
  }
}
