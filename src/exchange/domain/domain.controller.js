angular.module('Module.exchange.controllers').controller(
  'ExchangeTabDomainsCtrl',
  class ExchangeTabDomainsCtrl {
    constructor(
      $http,
      $scope,
      $translate,
      Exchange,
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
        Exchange,
        ExchangeDomains,
        exchangeServiceInfrastructure,
        exchangeStates,
        exchangeVersion,
        messaging,
        navigation,
      };

      this.$routerParams = Exchange.getParams();

      this.domainTypeAuthoritative = 'AUTHORITATIVE';
      this.domainTypeNonAuthoritative = 'NON_AUTHORITATIVE';

      this.loading = false;
      this.paginated = null;
      this.search = {
        value: null,
      };

      this.exchange = Exchange.value;

      if (exchangeServiceInfrastructure.isProvider()) {
        this.cnameRedirection = 'ex-mail.biz';
      } else {
        this.cnameRedirection = 'ovh.com';
      }

      $scope.$on(Exchange.events.domainsChanged, () => $scope.$broadcast('paginationServerSide.reload', 'domainsTable'));

      $scope.getDomains = (count, offset) => this.getDomains(count, offset);
      $scope.getPaginated = () => this.paginated;
      $scope.getLoading = () => this.loading;
    }

    goSearch() {
      this.services.$scope.$broadcast('paginationServerSide.loadPage', 1, 'domainsTable');
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

          _.forEach(this.paginated.domains, (domain) => {
            _.set(domain, 'domainTypes', domains.domainTypes);
          });

          this.setTooltips();
        })
        .finally(() => {
          this.loading = false;
        });
    }

    setTooltips() {
      if (_.has(this.paginated, 'domains') && !_.isEmpty(this.paginated.domains)) {
        _.forEach(this.paginated.domains, (domain) => {
          if (this.exchange != null) {
            this.setMxTooltip(domain);
            this.setSrvTooltip(domain);
          }
        });
      }
    }

    setMxTooltip(domain) {
      if (domain.mxValid) {
        _.set(domain, 'mxTooltip', this.services.$translate.instant(
          'exchange_tab_domain_diagnostic_mx_toolbox_ok',
        ));
      } else {
        _.set(domain, 'mxTooltip', this.services.$translate.instant(
          'exchange_tab_domain_diagnostic_mx_toolbox',
          { t0: this.exchange.hostname },
        ));
      }
    }

    setSrvTooltip(domain) {
      if (domain.srvValid) {
        _.set(domain, 'srvTooltip', this.services.$translate.instant(
          'exchange_tab_domain_diagnostic_srv_toolbox_ok',
        ));
      } else {
        _.set(domain, 'srvTooltip', this.services.$translate.instant(
          'exchange_tab_domain_diagnostic_srv_toolbox',
          { t0: this.exchange.hostname },
        ));
      }
    }

    containPartial() {
      if (_.has(this.paginated, 'domains') && !_.isEmpty(this.paginated.domains)) {
        return _.find(this.paginated.domains, 'partial') != null;
      }

      return false;
    }

    isReseller2010AuthInvalidMx() {
      return (
        this.services.exchangeServiceInfrastructure.isProvider()
        && this.services.exchangeVersion.isVersion(2010)
      );
    }

    isUpdateDisabled(domain) {
      return (
        !this.services.exchangeStates.constructor.isOk(domain)
        || domain.taskInProgress
        || this.isReseller2010AuthInvalidMx()
      );
    }

    isDeleteDisabled(domain) {
      return !this.services.exchangeStates.constructor.isOk(domain) || domain.accountsCount > 0;
    }

    getDeleteTooltip(domain) {
      return this.isDeleteDisabled(domain)
        ? this.services.$translate.instant('exchange_tab_domain_delete_domain_accounts_warning')
        : '';
    }
  },
);
