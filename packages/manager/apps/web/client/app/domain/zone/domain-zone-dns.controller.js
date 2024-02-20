import forEach from 'lodash/forEach';
import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import some from 'lodash/some';
import xor from 'lodash/xor';

export default class DomainTabZoneDnsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $q,
    $translate,
    activateZone,
    goToZoneHistory,
    coreConfig,
    orderZone,
    Alerter,
    Domain,
    WucUser,
  ) {
    this.$scope = $scope;
    this.productId = $stateParams.productId;
    this.$q = $q;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.Domain = Domain;
    this.WucUser = WucUser;

    this.activateZone = activateZone;
    this.goToZoneHistory = goToZoneHistory;
    this.orderZone = orderZone;
    this.region = coreConfig.getRegion();
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

    this.checkAlertZoneDeleteMessage();

    this.$scope.$on('domain.tabs.zonedns.refresh', () => {
      this.hasResult = false;
      this.search.filter = null;
      this.search.value = '';
      this.selectedRecords = [];
      this.refreshTable();
    });
    this.$scope.loadPaginated = (count, offset) =>
      this.loadPaginated(count, offset);

    this.checkAllowModification(this.domain.name);
    this.getZoneDns(this.domain.name);
    if (!this.domain.isExpired) {
      this.displayPropagationInfo(this.domain.name);
    }
  }

  navigateToZoneHistory() {
    this.goToZoneHistory({ productId: this.productId });
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
    if (!isEmpty(this.search.value)) {
      this.loading.table = true;
    }
    this.$scope.$broadcast('paginationServerSide.loadPage', 1);
  }

  /**
   * Checks if there's a localStorage item indicating a recent DNS zone deletion and triggers an alert.
   *
   * This function looks for a specific item in the localStorage, identified by a key that combines
   * a base string ('dns-delete-') with the domain name. The value of this item should be a date
   * representing when a DNS zone deletion was performed. If this date is within the last 72 hours,
   * an alert message is displayed. If the date is older than 72 hours, the item is removed from
   * localStorage, assuming the alert is no longer relevant.
   */
  checkAlertZoneDeleteMessage() {
    // Construct the localStorage key using the domain name
    const localStorageKey = `dns-delete-${this.domain.name}`;

    // Retrieve the stored value (date) from localStorage
    const storedValue = window.localStorage.getItem(localStorageKey);

    // Proceed only if a value was found
    if (storedValue) {
      // Parse the stored date using moment.js
      const storedDate = new Date(storedValue);
      const currentDate = new Date();

      // Calculate the difference in hours between the current date and the stored date
      const hoursDifference = Math.abs(
        (currentDate - storedDate) / (1000 * 60 * 60),
      );

      // Check if the difference is 72 hours or less
      if (hoursDifference <= 72) {
        // If within the last 72 hours, display a success alert
        this.$scope.$evalAsync(() => {
          this.Alerter.success(
            this.$translate.instant(
              'domain_configuration_zonedns_delete_all_success',
            ),
            this.$scope.alerts.main,
          );
        });
      } else {
        // If the stored date is older than 72 hours, remove the item from localStorage
        window.localStorage.removeItem(localStorageKey);
      }
    }
  }

  // DNS Data ---------------------------------------------------------------
  checkAllowModification(domainName) {
    return this.$q
      .all({
        domainServiceInfo: this.Domain.getServiceInfo(domainName).catch(
          () => null,
        ),
        zoneServiceInfo: this.Domain.getZoneServiceInfo(domainName),
        user: this.WucUser.getUser(),
      })
      .then(({ domainServiceInfo, zoneServiceInfo, user }) => {
        this.allowModification =
          user &&
          ((domainServiceInfo &&
            (domainServiceInfo.contactTech === user.nichandle ||
              domainServiceInfo.contactAdmin === user.nichandle)) ||
            (zoneServiceInfo &&
              (zoneServiceInfo.contactTech === user.nichandle ||
                zoneServiceInfo.contactAdmin === user.nichandle)));
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
          [defaults, { data: activated }] = results;
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
        this.defaultsDns = get(defaults, 'paginatedZone.records.results', [])
          .filter(
            (data) => data.subDomain === '' && data.subDomainToDisplay === '',
          )
          .map((value) => value.targetToDisplay.slice(0, -1))
          .sort();
        this.activatedDns = activated
          .filter((dns) => dns.isUsed)
          .map((value) => value.host)
          .sort();

        if (
          !isEmpty(this.defaultsDns) &&
          !isEqual(this.defaultsDns, this.activatedDns)
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
        if (get(tabZone, 'paginatedZone.records.results', []).length > 0) {
          this.hasResult = true;
        }
        this.displayActivateZone = false;
        this.applySelection();
        return this.Domain.getZoneStatus(this.domain.name).catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_dashboard_loading_error'),
            err,
            this.$scope.alerts.main,
          ),
        );
      })
      .then((data) => {
        this.zoneStatusErrors =
          (data && !data.isDeployed && get(data, 'errors', [])) || [];
        this.zoneStatusWarnings = get(data, 'warnings', []);
      })
      .catch((err) => {
        if (
          /service(\s|\s\w+\s)expired/i.test(
            get(err, 'data.message', err.message || ''),
          )
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
            get(err, 'data', err),
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

  // checboxes --------------------------------------------------------------
  applySelection() {
    forEach(get(this.zone, 'paginatedZone.records.results'), (item) => {
      // eslint-disable-next-line no-param-reassign
      item.selected = indexOf(this.selectedRecords, item.id) !== -1;
    });
  }

  globalCheckboxStateChange(state) {
    if (get(this.zone, 'paginatedZone.records.results')) {
      switch (state) {
        case 0:
          this.selectedRecords = [];
          this.atLeastOneSelected = false;
          break;
        case 1:
          this.selectedRecords = map(
            this.zone.paginatedZone.records.results,
            'id',
          ).filter((result) => !some(this.selectedRecords, result.id));
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
    this.selectedRecords = xor(this.selectedRecords, [record]);
    this.atLeastOneSelected = this.selectedRecords.length > 0;
    this.applySelection();
  }

  displayPropagationInfo(domainName) {
    this.Domain.getZoneHistory(domainName)
      .then((updateHistory) => {
        if (
          updateHistory.length > 0 &&
          moment(updateHistory[0]).isBetween(
            moment().subtract(24, 'hours'),
            moment(),
          )
        ) {
          this.Alerter.set(
            'alert-info',
            this.$translate.instant('domain_tab_ZONE_propagation_info'),
            null,
            this.$scope.alerts.main,
          );
        }
      })
      .catch((err) => {
        this.Alerter.alertFromSWS(
          this.$translate.instant('domain_tab_ZONE_default_ttl_error'),
          err,
          this.$scope.alerts.main,
        );
      });
  }
}
