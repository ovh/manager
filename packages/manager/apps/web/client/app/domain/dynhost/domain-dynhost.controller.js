import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';

angular.module('App').controller(
  'DomainTabDynHostCtrl',
  class DomainTabDynHostCtrl {
    /* @ngInject */
    constructor($scope, $q, $stateParams, $translate, Alerter, Domain) {
      this.$scope = $scope;
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
    }

    $onInit() {
      this.currentView = 'dynHostView';
      this.currentViewData = null;

      this.product = this.$scope.ctrlDomain.domain;
      this.domainHasZone = this.$scope.ctrlDomain.hasZoneDns;
      this.hasResult = false;
      this.loading = {
        init: false,
        dynHosts: false,
      };
      this.search = { subDomain: '' };

      this.$scope.$on('hosting.tabs.dynHosts.refresh', () => {
        this.hasResult = false;
        this.refreshTableDynHosts();
      });

      this.initialLoad();
    }

    initialLoad() {
      this.loading.init = true;
      this.zones = [];

      return this.Domain.getZones()
        .then((zones) => {
          this.zones = zones;

          if (this.domainHasZone) {
            this.refreshTableDynHosts();
          }
        })
        .catch((err) => {
          this.displayError(
            err,
            'domain_tab_DYNHOST_error',
            this.$scope.alerts.main,
          );
        })
        .finally(() => {
          this.loading.init = false;
        });
    }

    displayError(err, trKey, alert) {
      if (
        err.status === 460 &&
        err.data &&
        /service(\s|\s\w+\s)expired/i.test(err.data.message)
      ) {
        // If the service is really expired, the customers have already received several messages
        return;
      }
      this.Alerter.alertFromSWS(
        this.$translate.instant(trKey),
        get(err, 'data', err),
        alert,
      );
    }

    //---------------------------------------------
    // Navigation
    //---------------------------------------------

    selectSubView(view, data) {
      this.currentView = view;
      this.currentViewData = data || null;
    }

    resetInitialView() {
      this.currentView = 'dynHostView';
      this.currentViewData = null;
    }

    //---------------------------------------------
    // Search
    //---------------------------------------------

    emptySearch() {
      this.search.subDomain = '';
      this.refreshTableDynHosts();
    }

    //---------------------------------------------
    // DynHosts
    //---------------------------------------------
    refreshTableDynHosts() {
      this.loading.dynHosts = true;
      this.dynHosts = null;
      const subDomain = this.search.subDomain
        ? punycode.toASCII(this.search.subDomain)
        : null;

      return this.Domain.getDynHosts(this.product.name, subDomain)
        .then((data) => {
          this.dynHosts = data;
          if (!isEmpty(this.dynHosts)) {
            this.hasResult = true;
          }
        })
        .catch((err) =>
          this.displayError(
            err,
            'domain_tab_DYNHOST_error',
            this.$scope.alerts.main,
          ),
        )
        .finally(() => {
          if (isEmpty(this.dynHosts)) {
            this.loading.dynHosts = false;
          }
        });
    }

    transformItem(item) {
      return this.Domain.getDynHost(this.product.name, item).then(
        this.constructor.subDomainToPunycode,
        (err) => err,
      );
    }

    onTransformItemDone() {
      this.loading.dynHosts = false;
    }

    static subDomainToPunycode(item) {
      set(item, 'subDomain', punycode.toUnicode(item.subDomain));
      return item;
    }
  },
);
