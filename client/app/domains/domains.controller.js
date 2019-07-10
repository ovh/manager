angular.module('App').controller(
  'DomainsCtrl',
  class DomainsCtrl {
    /**
     * Constructor
     * @param $scope
     * @param $rootScope
     * @param $timeout
     * @param Domains
     * @param Navigator
     * @param Alerter
     * @param User
     */
    constructor(
      $scope,
      $state,
      $rootScope,
      $timeout,
      $translate,
      Domains,
      Navigator,
      Alerter,
      User,
    ) {
      this.$scope = $scope;
      this.$state = $state;
      this.$rootScope = $rootScope;
      this.$timeout = $timeout;
      this.$translate = $translate;
      this.Domains = Domains;
      this.Navigator = Navigator;
      this.Alerter = Alerter;
      this.User = User;
    }

    $onInit() {
      this.atLeastOneSelected = false;
      this.hasResult = false;
      this.loading = {
        init: true,
        domainsInfos: false,
        domainsError: false,
        domainsSearch: false,
        domainsExportCsv: false,
      };
      this.search = { value: null };
      this.stepPath = '';

      this.User.getUrlOf('bulkChangeOwner')
        .then((link) => {
          this.urlBulkChangeOwner = link;
        })
        .catch(() => {
          this.urlBulkChangeOwner = null;
        });

      this.$scope.domains = null;
      this.$scope.selectedDomains = [];
      this.$scope.alerts = {
        page: 'alerts.domains.page',
        main: 'alerts.domains.main',
      };
      this.$scope.currentAction = null;
      this.$scope.currentActionData = null;

      this.$scope.loadDomains = (count, offset) => {
        this.loading.domainsInfos = true;
        this.loading.domainsSearch = true;

        this.Domains.getDomains(count, offset, this.search.value)
          .then((domains) => {
            this.$scope.domains = domains;
            if (_.get(domains, 'list.results', []).length > 0) {
              this.hasResult = true;
            }
            this.applySelection();
          })
          .catch(() => {
            this.loading.domainsError = true;
            this.Alerter.error(
              this.$translate.instant('domains_dashboard_loading_error'),
              this.$scope.alerts.page,
            );
          })
          .finally(() => {
            this.loading.init = false;
            this.loading.domainsInfos = false;
            this.loading.domainsSearch = false;
          });
      };

      this.$scope.setActionMultiple = (action, data) => this.setAction(action, 'domains/', data);
      this.$scope.resetAction = () => this.setAction(false);
      this.$scope.getSelectedDomains = () => this.$scope.selectedDomains;

      this.$scope.$watch('selectedDomains', () => this.applySelection(), true);
      this.$scope.$on('$locationChangeStart', () => this.$scope.resetAction());
      this.$scope.$on('domain.csv.export.cancel', () => {
        this.loading.domainsExportCsv = false;
      });
      this.$scope.$on('domain.csv.export.doing', () => {
        this.loading.domainsExportCsv = true;
      });
      this.$scope.$on('domain.csv.export.done', () => {
        this.loading.domainsExportCsv = false;
      });
      this.$scope.$on('domain.csv.export.error', () => {
        this.loading.domainsExportCsv = false;
      });
      this.$scope.$on('domains.list.refresh', () => {
        this.$scope.selectedDomains = [];
        this.$scope.$broadcast('paginationServerSide.reload');
      });
    }

    applySelection() {
      _.forEach(_.get(this.$scope.domains, 'list.results'), (value) => {
        _.set(value, 'selected', _.indexOf(this.$scope.selectedDomains, value.name) !== -1);
      });
    }

    emptySearch() {
      this.search.value = '';
      this.goSearch();
    }

    goSearch() {
      if (!_.isEmpty(this.search.value)) {
        this.loading.domainsSearch = true;
      }
      this.$scope.$broadcast('paginationServerSide.loadPage', 1);
    }

    /**
     * Handle checkboxes with "deselect/select all" option
     * @param {integer} state
     */
    globalCheckboxStateChange(state) {
      if (_.get(this.$scope.domains, 'list.results')) {
        switch (state) {
          case 0:
            this.$scope.selectedDomains = [];
            this.atLeastOneSelected = false;
            break;
          case 1:
            this.$scope.selectedDomains = _.map(
              this.$scope.domains.list.results,
              'name',
            ).filter(result => !_.some(this.$scope.selectedDomains, result.name));
            this.atLeastOneSelected = true;
            break;
          case 2:
            this.$scope.selectedDomains = this.$scope.domains.fullDomainsList;
            this.atLeastOneSelected = true;
            break;
          default:
            break;
        }
      }
    }

    /**
     * Redirect to domain page
     * @param {string} domain name
     */
    openDomain(domain) {
      this.$rootScope.$broadcast('leftNavigation.selectProduct.fromName', {
        name: domain,
        type: 'DOMAIN',
      });
    }

    /**
     * Toggle the clicked domain checkbox
     * @param {string} domain name
     */
    toggleDomain(domain) {
      this.$scope.selectedDomains = _.xor(this.$scope.selectedDomains, [
        domain,
      ]);
      this.atLeastOneSelected = this.$scope.selectedDomains.length > 0;
    }

    /**
     * Set Action
     * @param action
     * @param baseStepPath
     * @param data
     */
    setAction(action, baseStepPath, data) {
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;

      if (action) {
        this.stepPath = `${baseStepPath}${this.$scope.currentAction}.html`;
        $('#currentAction').modal({ keyboard: true, backdrop: 'static' });
      } else {
        $('#currentAction').modal('hide');
        this.$scope.currentActionData = null;
        this.$timeout(() => {
          this.stepPath = '';
        }, 300);
      }
    }
  },
);
