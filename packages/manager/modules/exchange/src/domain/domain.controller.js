import find from 'lodash/find';
import forEach from 'lodash/forEach';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import {
  GLOBAL_DKIM_STATUS,
  DKIM_STATUS,
  DKIM_MATCHING_SCHEMA_STATUS,
} from './domain.constants';

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

    this.GLOBAL_DKIM_STATUS = GLOBAL_DKIM_STATUS;
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

  dkimGlobalStatus({ dkim: dkimSelectors }) {
    if (dkimSelectors.length === 0) {
      return this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED;
    }

    if (
      dkimSelectors.find(({ status }) =>
        DKIM_MATCHING_SCHEMA_STATUS.OK.includes(status),
      )
    ) {
      return this.GLOBAL_DKIM_STATUS.OK;
    }

    if (
      DKIM_MATCHING_SCHEMA_STATUS.DISABLED.includes(dkimSelectors[0].status) &&
      (!dkimSelectors[1] ||
        DKIM_MATCHING_SCHEMA_STATUS.DISABLED.includes(dkimSelectors[1].status))
    ) {
      return this.GLOBAL_DKIM_STATUS.DISABLED;
    }

    if (
      dkimSelectors.find(({ status }) =>
        DKIM_MATCHING_SCHEMA_STATUS.IN_PROGRESS.includes(status),
      )
    ) {
      return this.GLOBAL_DKIM_STATUS.IN_PROGRESS;
    }

    return this.GLOBAL_DKIM_STATUS.NOK;
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

  setDkimColorClass(status) {
    switch (status) {
      case this.GLOBAL_DKIM_STATUS.OK:
        return 'oui-badge_success';
      case this.GLOBAL_DKIM_STATUS.DISABLED:
        return 'oui-badge_warning';
      case this.GLOBAL_DKIM_STATUS.NOT_CONFIGURED:
        return 'oui-background-g-100';
      case this.GLOBAL_DKIM_STATUS.IN_PROGRESS:
        return 'oui-badge_info';
      case this.GLOBAL_DKIM_STATUS.NOK:
        return 'oui-badge_error';
      default:
        return '';
    }
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
