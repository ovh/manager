export default class DomainTabZoneDnsCtrl {
  /* @ngInject */
  constructor($scope, $q, $translate, activateZone, Alerter, Domain, User) {
    this.$scope = $scope;
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Domain = Domain;
    this.User = User;

    this.activateZone = activateZone;
  }

  $onInit() {
    this.domain = this.$scope.ctrlDomain.domain;

    this.allowModification = false;
    this.atLeastOneSelected = false;
    this.hasResult = false;
    this.loading = {
      table: false,
      zone: true,
    };
    this.search = {
      filter: null,
      value: '',
    };
    this.selectedRecords = [];
    this.useDefaultsDns = true;
    this.typesToCheck = ['MX', 'NS', 'SRV', 'CNAME']; // Check if target is relative for this type

    this.$scope.$on('domain.tabs.zonedns.refresh', () => {
      this.hasResult = false;
      this.search.filter = null;
      this.search.value = '';
      this.selectedRecords = [];
      this.refreshTable();
    });
    this.$scope.loadPaginated = (count, offset) => this.loadPaginated(count, offset);

    this.checkAllowModification(this.domain.name);
    this.getZoneDns(this.domain.name);
  }

  // Searching --------------------------------------------------------------
  emptyFilter() {
    this.search.filter = null;
    this.goSearch();
  }

  emptySearch() {
    this.search.value = '';
    this.goSearch();
  }

  goSearch() {
    if (!_.isEmpty(this.search.value)) {
      this.loading.table = true;
    }
    this.$scope.$broadcast('paginationServerSide.loadPage', 1);
  }

  // DNS Data ---------------------------------------------------------------
  checkAllowModification(domainName) {
    return this.$q
      .all({
        domainServiceInfo: this.Domain.getServiceInfo(domainName).catch(() => null),
        zoneServiceInfo: this.Domain.getZoneServiceInfo(domainName),
        user: this.User.getUser(),
      })
      .then(({ domainServiceInfo, zoneServiceInfo, user }) => {
        this.allowModification = user
            && ((domainServiceInfo
              && (domainServiceInfo.contactTech === user.nichandle
                || domainServiceInfo.contactAdmin === user.nichandle))
              || (zoneServiceInfo
                && (zoneServiceInfo.contactTech === user.nichandle
                  || zoneServiceInfo.contactAdmin === user.nichandle)));
      });
  }

  static getDomainToDisplay(record) {
    return `${(record.subDomainToDisplay
      ? `${record.subDomainToDisplay}.`
      : '') + record.zoneToDisplay}.`;
  }

  getZoneDns(domainName) {
    let defaults;
    let activated;

    this.loading.dns = true;
    return this.$q
      .allSettled([
        this.Domain.getTabZoneDns(domainName, 0, 0, null, 'NS'),
        this.Domain.getTabDns(domainName),
      ])
      .then(
        (results) => {
          [defaults, activated] = results;
        },
        (err) => {
          if (err[0].code !== 404 || err[1].code) {
            // LEGIT 404
            throw err;
          }

          [, activated] = err;
        },
      )
      .finally(() => {
        this.defaultsDns = _.get(
          defaults,
          'paginatedZone.records.results',
          [],
        )
          .filter(data => data.subDomain === '' && data.subDomainToDisplay === '')
          .map(value => value.targetToDisplay.slice(0, -1))
          .sort();
        this.activatedDns = _.get(activated, 'dns', [])
          .filter(dns => dns.isUsed)
          .map(value => value.host)
          .sort();

        if (
          !_.isEmpty(this.defaultsDns)
            && !_.isEqual(this.defaultsDns, this.activatedDns)
        ) {
          this.useDefaultsDns = false;
        }

        this.loading.dns = false;
      });
  }

  loadPaginated(count, offset) {
    this.loading.table = true;

    return this.Domain.getTabZoneDns(
      this.domain.name,
      count,
      offset,
      this.search.value || '',
      this.search.filter,
    )
      .then((tabZone) => {
        this.zone = tabZone;
        if (_.get(tabZone, 'paginatedZone.records.results', []).length > 0) {
          this.hasResult = true;
        }
        this.displayActivateZone = false;
        this.applySelection();
        return this.Domain.getZoneStatus(this.domain.name).catch(err => this.Alerter.alertFromSWS(
          this.$translate.instant('domain_dashboard_loading_error'),
          err,
          this.$scope.alerts.main,
        ));
      })
      .then((data) => {
        this.zoneStatusErrors = (data && !data.isDeployed && _.get(data, 'errors', [])) || [];
        this.zoneStatusWarnings = _.get(data, 'warnings', []);
      })
      .catch((err) => {
        if (
          /service(\s|\s\w+\s)expired/i.test(_.get(err, 'data.message', err.message || ''))
        ) {
          // A service expired here, is a temporary status, display the message: "service expired
          // in the page as general message is very confusing for customers.
          // A message like: "no DNS zone" is already displayed at the good place. So, get out.
          this.displayActivateZone = false;
          return;
        }

        // For Domain with no DNS zone.
        if (err.code && err.code === 404) {
          this.displayActivateZone = true;
        } else {
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_dashboard_loading_error'),
            _.get(err, 'data', err),
            this.$scope.alerts.main,
          );
        }
      })
      .finally(() => {
        this.loading.table = false;
        this.loading.zone = false;
      });
  }

  refreshTable() {
    if (!this.loading.zone) {
      this.$scope.$broadcast('paginationServerSide.reload');
    }
  }

  targetIsRelativeDomain(domain) {
    return (
      domain.target
        && _.indexOf(this.typesToCheck, domain.fieldType) !== -1
        && /\..*[^.]$/.test(domain.target)
    );
  }

  // checboxes --------------------------------------------------------------
  applySelection() {
    _.forEach(_.get(this.zone, 'paginatedZone.records.results'), (item) => {
        item.selected = _.indexOf(this.selectedRecords, item.id) !== -1; // eslint-disable-line
    });
  }

  globalCheckboxStateChange(state) {
    if (_.get(this.zone, 'paginatedZone.records.results')) {
      switch (state) {
        case 0:
          this.selectedRecords = [];
          this.atLeastOneSelected = false;
          break;
        case 1:
          this.selectedRecords = _.map(
            this.zone.paginatedZone.records.results,
            'id',
          ).filter(result => !_.some(this.selectedRecords, result.id));
          this.atLeastOneSelected = true;
          break;
        case 2:
          this.selectedRecords = this.zone.fullRecordsIdsList;
          this.atLeastOneSelected = true;
          break;
        default:
          break;
      }
      this.applySelection();
    }
  }

  toggleRecord(record) {
    this.selectedRecords = _.xor(this.selectedRecords, [record]);
    this.atLeastOneSelected = this.selectedRecords.length > 0;
    this.applySelection();
  }
}
