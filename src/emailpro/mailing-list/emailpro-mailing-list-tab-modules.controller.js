angular.module('App').controller(
  'EmailProMXPlanMailingListsTabModulesCtrl',
  class EmailProMXPlanMailingListsTabModulesCtrl {
    /**
     * Constructor
     * @param $scope
     * @param $filter
     * @param $stateParams
     * @param $translate
     * @param Alerter
     * @param WucEmails
     * @param EmailProMXPlanMailingLists
     */
    constructor(
      $scope,
      $filter,
      $http,
      $stateParams,
      $translate,
      Alerter,
      WucEmails,
      EmailProMXPlanMailingLists,
    ) {
      this.$scope = $scope;
      this.$filter = $filter;
      this.$http = $http;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.WucEmails = WucEmails;
      this.EmailProMXPlanMailingLists = EmailProMXPlanMailingLists;
    }

    $onInit() {
      this.$http.get(`/hosting/web/${this.$scope.exchange.associatedDomainName}`)
        .then((hosting) => {
          this.$scope.hosting = hosting;
        });

      this.mailingListsDetails = [];
      this.loading = {
        mailingLists: false,
        pager: false,
        quotas: false,
      };
      this.search = {
        EmailProMXPlanMailingLists: '',
      };

      this.$scope.$on('hosting.tabs.EmailProMXPlanMailingLists.refresh', () => this.refreshTableEmailProMXPlanMailingLists(true));
      this.$scope.$on('EmailProMXPlanMailingLists.update.poll.done', () => this.refreshTableEmailProMXPlanMailingLists(true));
      this.$scope.$on('$destroy', () => {
        this.Alerter.resetMessage(this.$scope.alerts.tabs);
        this.EmailProMXPlanMailingLists.killAllPolling({
          namespace: 'EmailProMXPlanMailingLists.update.poll',
        });
      });

      this.getQuotas().then(() => this.refreshTableEmailProMXPlanMailingLists());
    }

    //---------------------------------------------
    // Search
    //---------------------------------------------

    emptySearch() {
      this.search.EmailProMXPlanMailingLists = '';
      this.refreshTableEmailProMXPlanMailingLists(true);
    }

    goSearch() {
      this.refreshTableEmailProMXPlanMailingLists(true);
    }

    //---------------------------------------------
    // Mailing lists
    //---------------------------------------------

    getQuotas() {
      this.loading.quotas = true;
      return this.WucEmails.getQuotas(this.$scope.exchange.associatedDomainName)
        .then((quotas) => {
          this.quotas = quotas;
        })
        .catch((err) => {
          _.set(err, 'type', err.type || 'ERROR');
          this.Alerter.alertFromSWS(
            this.$translate.instant('mailing_list_tab_modal_get_lists_error'),
            err,
            this.$scope.alerts.tabs,
          );
        })
        .finally(() => {
          this.loading.quotas = false;
        });
    }

    refreshTableEmailProMXPlanMailingLists(forceRefresh) {
      this.loading.mailingLists = true;
      this.mailingLists = null;
      return this.EmailProMXPlanMailingLists
        .getEmailProMXPlanMailingLists(this.$scope.exchange.associatedDomainName, {
          name: `%${this.search.EmailProMXPlanMailingLists}%`,
          forceRefresh,
        })
        .then((data) => {
          this.mailingLists = this.$filter('orderBy')(data);
        })
        .catch((err) => {
          _.set(err, 'type', err.type || 'ERROR');
          this.Alerter.alertFromSWS(
            this.$translate.instant('mailing_list_tab_modal_get_lists_error'),
            err,
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          if (_.isEmpty(this.emailProMXPlanMailingLists)) {
            this.loading.mailingLists = false;
          }
        });
    }

    transformItem(item) {
      return this.EmailProMXPlanMailingLists.getMailingList(
        this.$scope.exchange.associatedDomainName,
        item,
      );
    }

    onTransformItemDone() {
      this.loading.mailingLists = false;
      this.loading.pager = false;
    }
  },
);
