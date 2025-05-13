import find from 'lodash/find';
import forEach from 'lodash/forEach';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import { DKIM_STATUS, DKIM_STATUS_CLASS } from './domain.constants';

export default class ExchangeTabDomainsCtrl {
  /* @ngInject */
  constructor(
    $http,
    $scope,
    $translate,
    wucExchange,
    ExchangeDomains,
    exchangeServiceInfrastructure,
    exchangeStates,
    exchangeVersion,
    messaging,
    navigation,
  ) {
    this.services = {
      $http,
      $scope,
      $translate,
      wucExchange,
      ExchangeDomains,
      exchangeServiceInfrastructure,
      exchangeStates,
      exchangeVersion,
      messaging,
      navigation,
    };

    this.$routerParams = wucExchange.getParams();

    this.domainTypeAuthoritative = 'AUTHORITATIVE';
    this.domainTypeNonAuthoritative = 'NON_AUTHORITATIVE';

    this.loading = false;
    this.paginated = null;
    this.search = {
      value: null,
    };

    this.exchange = wucExchange.value;

    if (exchangeServiceInfrastructure.isProvider()) {
      this.cnameRedirection = 'ex-mail.biz';
    } else {
      this.cnameRedirection = 'ovh.com';
    }

    $scope.$on(wucExchange.events.domainsChanged, () =>
      $scope.$broadcast('paginationServerSide.reload', 'domainsTable'),
    );

    $scope.getDomains = (count, offset) => this.getDomains(count, offset);
    $scope.getPaginated = () => this.paginated;
    $scope.getLoading = () => this.loading;

    this.DKIM_STATUS = DKIM_STATUS;
  }

  goSearch() {
    this.services.$scope.$broadcast(
      'paginationServerSide.loadPage',
      1,
      'domainsTable',
    );
  }

  emptySearch() {
    this.search.value = '';
    this.goSearch();
  }

  getDomains(count, offset) {
    this.loading = true;

    this.services.ExchangeDomains.gettingDomains(
      this.$routerParams.organization,
      this.$routerParams.productId,
      count,
      offset,
      this.search.value,
    )
      .then((domains) => {
        this.paginated = domains;

        forEach(this.paginated.domains, (domain) => {
          set(domain, 'domainTypes', domains.domainTypes);
        });

        this.setTooltips();
      })
      .finally(() => {
        this.loading = false;
      });
  }

  setTooltips() {
    if (has(this.paginated, 'domains') && !isEmpty(this.paginated.domains)) {
      forEach(this.paginated.domains, (domain) => {
        if (this.exchange != null) {
          this.setMxTooltip(domain);
          this.setSrvTooltip(domain);
          this.setSpfTooltip(domain);
        }
      });
    }
  }

  static getDkimColorClass({ dkimDiagnostics: { state } }) {
    return DKIM_STATUS_CLASS[state] || '';
  }

  setMxTooltip(domain) {
    if (domain.mxValid) {
      set(
        domain,
        'mxTooltip',
        this.services.$translate.instant(
          'exchange_tab_domain_diagnostic_mx_toolbox_ok',
        ),
      );
    } else {
      set(
        domain,
        'mxTooltip',
        this.services.$translate.instant(
          'exchange_tab_domain_diagnostic_mx_toolbox',
          { t0: this.exchange.hostname },
        ),
      );
    }
  }

  setSrvTooltip(domain) {
    if (domain.srvValid) {
      set(
        domain,
        'srvTooltip',
        this.services.$translate.instant(
          'exchange_tab_domain_diagnostic_srv_toolbox_ok',
        ),
      );
    } else {
      set(
        domain,
        'srvTooltip',
        this.services.$translate.instant(
          'exchange_tab_domain_diagnostic_srv_toolbox',
          { t0: this.exchange.hostname },
        ),
      );
    }
  }

  setSpfTooltip(domain) {
    if (domain.spfValid) {
      set(
        domain,
        'spfTooltip',
        this.services.$translate.instant(
          'exchange_tab_domain_diagnostic_spf_toolbox_ok',
        ),
      );
    } else {
      set(
        domain,
        'spfTooltip',
        this.services.$translate.instant(
          'exchange_tab_domain_diagnostic_spf_toolbox',
          { t0: this.exchange.hostname },
        ),
      );
    }
  }

  containPartial() {
    if (has(this.paginated, 'domains') && !isEmpty(this.paginated.domains)) {
      return find(this.paginated.domains, 'partial') != null;
    }

    return false;
  }

  isReseller2010AuthInvalidMx() {
    return (
      this.services.exchangeServiceInfrastructure.isProvider() &&
      this.services.exchangeVersion.isVersion(2010)
    );
  }

  isUpdateDisabled(domain) {
    return (
      !this.services.exchangeStates.constructor.isOk(domain) ||
      domain.taskInProgress ||
      this.isReseller2010AuthInvalidMx()
    );
  }

  isDeleteDisabled(domain) {
    return (
      !this.services.exchangeStates.constructor.isOk(domain) ||
      domain.accountsCount > 0
    );
  }

  getDeleteTooltip(domain) {
    return this.isDeleteDisabled(domain)
      ? this.services.$translate.instant(
          'exchange_tab_domain_delete_domain_accounts_warning',
        )
      : '';
  }
}
