import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
// import remove from 'lodash/remove';
import set from 'lodash/set';

export default class DomainDnsModifyCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $filter,
    $q,
    $stateParams,
    $translate,
    Domain,
    WucUser,
    WucValidator,
    constants,
  ) {
    this.$scope = $scope;
    this.$filter = $filter;
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Domain = Domain;
    this.WucUser = WucUser;
    this.WucValidator = WucValidator;
    this.constants = constants;
  }

  $onInit() {
    this.dns = {
      original: null,
      table: null,
    };
    this.loading = {
      add: false,
      all: false,
      table: false,
    };

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
        this.loadTable();
      })
      .catch(() => {
        this.loading.all = false;
      });
  }

  loadTable() {
    this.loading.table = true;
    this.dns.table = [];
    return this.Domain.getDnsList(this.$stateParams.productId)
      .then(({ data: dnsList }) => {
        this.dns.table = { dns: dnsList };
        this.dns.original = angular.copy(this.dns.table);
        this.checkPendingPropagation(this.dns.table.dns);
        return this.$q.all(
          map(dnsList.dns, (nameServer) =>
            this.Domain.getNameServerStatus(
              this.$stateParams.productId,
              nameServer.id,
            ),
          ),
        );
      })
      .finally(() => {
        this.loading.all = false;
        this.loading.table = false;
      });
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

  saveDns() {
    let dns = filter(
      this.dns.table.dns,
      (currentDNS) => currentDNS.editedHost !== '' || currentDNS.editedIp,
    );

    if (!isEmpty(dns)) {
      this.loading.table = true;
      dns = map(dns, (d) => ({
        host: d.editedHost || d.host,
        ip: d.editedIp || (d.editedIp === '' ? null : d.ip),
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
          this.loadTable();
        });
    }

    this.dns.table.dns = filter(
      this.dns.table.dns,
      (currentDNS) => currentDNS.host || currentDNS.ip,
    );
  }
}
