import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';
import some from 'lodash/some';

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
  }

  $onInit() {
    this.allowModification = false;
    this.atLeastOneDns = true;
    this.atLeastOneToRemove = true;
    this.dns = {
      original: null,
      table: null,
      activeDns: null,
    };
    this.dnsStatus = {
      isHosted: null,
      isOk: null,
    };
    this.isDnssecEnable = false;
    this.editMode = false;
    this.loading = {
      add: false,
      all: false,
      table: false,
    };
    this.urls = {
      zoneCheck: this.constants.urls.TOOLS.ZONE_CHECK,
    };

    this.$scope.$on('Domain.Dns.Reload', () => this.init());
    this.$scope.loadTable = () => this.loadTable();

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
    this.loading.all = true;
    return this.Domain.getSelected(this.$stateParams.productId)
      .then((domain) => {
        this.domain = domain;
        this.isDnssecEnable = domain.dnssecStatus === 'ENABLED';
        this.loadTable();
      })
      .catch(() => {
        this.loading.all = false;
      });
  }

  loadTable() {
    this.loading.table = true;
    this.dns.table = [];
    return this.Domain.getTabDns(this.$stateParams.productId)
      .then((tabDns) => {
        this.dns.table = tabDns;
        this.dns.original = angular.copy(tabDns);
        this.dns.activeDns = this.$filter('filter')(tabDns.dns, {
          isUsed: true,
          toDelete: false,
        }).length;
        this.displayPropogationInfo(tabDns.dns);
        return this.$q.all(
          map(tabDns.dns, (nameServer) =>
            this.Domain.getNameServerStatus(
              this.$stateParams.productId,
              nameServer.id,
            ),
          ),
        );
      })
      .then((nameServersStatus) => {
        if (!isEmpty(nameServersStatus)) {
          this.dnsStatus.isOk = !some(nameServersStatus, { state: 'ko' });
          this.dnsStatus.isHosted = !some(nameServersStatus, {
            type: 'external',
          });
        }
      })
      .finally(() => {
        this.loading.all = false;
        this.loading.table = false;
      });
  }

  activeEditMode() {
    this.editMode = true;
  }

  addNewLine() {
    return (
      this.dns.table.dns.length >= 10 ||
      this.dns.table.dns.push({ editedHost: '', editedIp: '' })
    );
  }

  removeLine(item) {
    remove(this.dns.table.dns, item);
    const filtered = filter(
      this.dns.table.dns,
      (currentDNS) => !currentDNS.toDelete,
    );
    this.atLeastOneToRemove = this.dns.table.dns && filtered.length > 1;
  }

  cancelDns() {
    this.dns.table.dns = angular.copy(this.dns.original.dns);
    this.atLeastOneDns = true;
    this.atLeastOneToRemove = true;
    this.editMode = false;
  }

  checkAtLeastOneDns() {
    const filtered = filter(
      this.dns.table.dns,
      (currentDNS) =>
        !currentDNS.toDelete &&
        ((currentDNS.host && currentDNS.editedHost == null) ||
          (currentDNS.editedHost && currentDNS.editedHost !== '')),
    );
    this.atLeastOneDns = this.dns.table.dns && filtered.length > 0;
  }

  hostCheck(input) {
    const value = input.$viewValue;
    input.$setValidity(
      'domain',
      value === '' || this.WucValidator.isValidDomain(value),
    );
  }

  ipCheck(input) {
    const value = input.$viewValue;
    input.$setValidity(
      'ip',
      value === '' ||
        this.WucValidator.isValidIpv4(value) ||
        this.WucValidator.isValidIpv6(value),
    );
  }

  dnsLock() {
    this.$scope.currentAction = 'dns/lock/domain-dns-lock';
    this.$scope.currentActionData = false;
    $('#currentAction').modal({
      keyboard: true,
      backdrop: 'static',
    });
  }

  saveDns() {
    let dns = filter(
      this.dns.table.dns,
      (currentDNS) => currentDNS.editedHost !== '' || currentDNS.editedIp,
    );

    if (!isEmpty(dns)) {
      this.loading.table = true;
      dns = map(dns, (d) => ({
        host: d.editedHost || d.host,
        ip: d.editedIp || d.ip || undefined,
      }));

      this.$q
        .when(
          this.domain.managedByOvh
            ? this.Domain.updateNameServerType(
                this.$stateParams.productId,
                'external',
              )
            : null,
        )
        .then(() => {
          this.domain.managedByOvh = false;
          return this.Domain.updateDnsNameServerList(
            this.$stateParams.productId,
            dns,
          );
        })
        .catch((err) => {
          set(err, 'type', err.type || 'ERROR');
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_DNS_update_error'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.editMode = false;
          this.loadTable();
        });
    }

    this.dns.table.dns = filter(
      this.dns.table.dns,
      (currentDNS) => currentDNS.host || currentDNS.ip,
    );
    this.editMode = false;
  }

  displayPropogationInfo(dnsServers) {
    if (dnsServers.some((server) => server.toDelete || !server.isUsed)) {
      this.Alerter.success(
        this.$translate.instant('domain_tab_DNS_update_success'),
        this.$scope.alerts.main,
      );
    } else {
      this.Alerter.resetMessage(this.$scope.alerts.main);
    }
  }
}
