import forEach from 'lodash/forEach';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';

angular.module('controllers').controller(
  'controllers.Domain.Redirection',
  class DomainRedirectionCtrl {
    /* @ngInject */
    constructor($scope, $translate, Alerter, Domain) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
    }

    $onInit() {
      this.domain = this.$scope.ctrlDomain.domain;
      this.hasZoneDns = this.$scope.ctrlDomain.hasZoneDns;
      this.forceRefresh = true;
      this.hasResult = false;

      this.loading = {
        exportCSV: false,
        init: true,
        search: false,
      };

      this.redirectionList = null;
      this.scroll = false;
      this.search = {
        filter: null,
        value: null,
      };

      this.$scope.$on('domain.tabs.redirection.reload', (event, forceRef) => {
        this.setLoadingMode(forceRef);
        this.$scope.$broadcast(
          'paginationServerSide.reload',
          'redirectionTable',
        );
      });

      this.$scope.$on('domain.tabs.redirection.load', (event, forceRef) => {
        this.setLoadingMode(forceRef);
        this.$scope.$broadcast(
          'paginationServerSide.loadPage',
          1,
          'redirectionTable',
        );
      });

      this.$scope.loadRedirection = (count, offset) =>
        this.loadRedirection(count, offset);
    }

    loadRedirection(count, offset) {
      if (!this.hasZoneDns) {
        this.loading.init = false;
        return;
      }

      this.loading.search = true;

      const model = {
        elementsByPage: count,
        elementsToSkip: offset,
        searchedType: this.search.filter || null,
        search: this.search.value || null,
      };

      this.Domain.getRedirection(this.domain.name, model, this.forceRefresh)
        .then((results) => {
          this.forceRefresh = false;
          this.redirectionList = results;

          if (has(results, 'list.results') && !isEmpty(results.list.results)) {
            this.hasResult = true;
          }
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_REDIRECTION_load_fail'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading.init = false;
          this.loading.search = false;

          if (this.scroll) {
            $('html, body').animate(
              { scrollTop: $('#domainTabRedirection').offset().top },
              500,
            );
            this.scroll = false;
          }
        });
    }

    // Searching --------------------------------------------------------------
    emptyFilter() {
      this.search.filter = '';
      this.goSearch();
    }

    emptySearch() {
      this.search.value = '';
      this.goSearch();
    }

    goSearch() {
      if (!isEmpty(this.search.value)) {
        this.loading.search = true;
      }

      this.$scope.$broadcast(
        'paginationServerSide.loadPage',
        1,
        'redirectionTable',
      );
    }

    // Redirects data ---------------------------------------------------------
    reloadRedirectTable() {
      if (!this.loading.search) {
        this.forceRefresh = true;
        this.scroll = true;
        this.$scope.$broadcast(
          'paginationServerSide.reload',
          'redirectionTable',
        );
      }
    }

    static getDomain(redirection) {
      if (redirection == null) {
        return '';
      }

      const separator = redirection.subDomainDisplayName === '' ? '' : '.';

      return `${redirection.subDomainDisplayName}${separator}${redirection.zoneDisplayName}`;
    }

    // Export CSV -------------------------------------------------------------
    getDatasToExport() {
      this.loading.exportCSV = true;
      const model = {
        elementsByPage: 0,
        elementsToSkip: 0,
        searchedType: null,
        search: null,
      };

      return this.Domain.getRedirection(this.domain.name, model, true)
        .then((results) => {
          const datasToReturn = [
            [
              '',
              this.$translate.instant(
                'domain_tab_REDIRECTION_table_headers_field',
              ),
              this.$translate.instant(
                'domain_tab_REDIRECTION_table_headers_type',
              ),
              this.$translate.instant(
                'domain_tab_REDIRECTION_table_headers_target',
              ),
            ],
          ];

          forEach(results.list.results, (redirection) => {
            datasToReturn.push([
              redirection.fieldDisplayType,
              this.constructor.getDomain(redirection),
              this.$translate.instant(
                `domain_tab_REDIRECTION_type_${redirection.fieldDisplayType}`,
              ),
              redirection.targetDisplayName,
            ]);
          });

          return datasToReturn;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_REDIRECTION_load_fail'),
            err,
            this.$scope.alerts.main,
          );
          return [];
        })
        .finally(() => {
          this.loading.exportCSV = false;
        });
    }

    // Utils
    setLoadingMode(forceRefresh) {
      this.loading.init = true;
      this.search.value = null;
      this.forceRefresh = forceRefresh;
      this.scroll = true;
    }
  },
);
