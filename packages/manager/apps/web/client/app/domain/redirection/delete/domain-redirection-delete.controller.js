import find from 'lodash/find';
import get from 'lodash/get';

angular.module('controllers').controller(
  'controllers.Domain.Redirection.delete',
  class DomainRedirectionDeleteCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $rootScope,
      $q,
      $stateParams,
      $translate,
      Alerter,
      Domain,
    ) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
    }

    $onInit() {
      this.entryToDelete = this.$scope.currentActionData.redirection;
      this.entryToDeleteName = this.$scope.currentActionData.displayName;

      this.isSubDomain = this.entryToDeleteName.split('.').length > 2;
      this.loading = false;
      this.wwwDomainToDelete = {
        data: null,
        removeWWW: false,
      };

      this.$scope.deleteRedirection = () => this.deleteRedirection();

      this.Domain.getRedirection(
        this.$stateParams.productId,
        {
          elementsByPage: 100,
          elementsToSkip: 0,
          search: this.entryToDelete.subDomain,
        },
        true,
      ).then((results) => {
        this.wwwDomainToDelete.data = find(
          get(results, 'list.results'),
          (redirection) =>
            redirection.subDomain === `www.${this.entryToDelete.subDomain}` ||
            (redirection.subDomain === 'www' &&
              this.entryToDelete.subDomain !== 'www'),
        );
      });
    }

    static getDomainName(domain) {
      return domain ? `${domain.subDomain}.${domain.zoneDisplayName}` : '';
    }

    deleteRedirection() {
      this.loading = true;

      const deletePromises = [
        this.Domain[
          this.entryToDelete.isOrt === true
            ? 'deleteRedirection'
            : 'deleteDnsEntry'
        ](this.$stateParams.productId, this.entryToDelete.id),
      ];
      if (this.wwwDomainToDelete.data && this.wwwDomainToDelete.removeWWW) {
        deletePromises.push(
          this.Domain[
            this.wwwDomainToDelete.data.isOrt === true
              ? 'deleteRedirection'
              : 'deleteDnsEntry'
          ](this.$stateParams.productId, this.wwwDomainToDelete.data.id),
        );
      }

      return this.$q
        .all(deletePromises)
        .then(() =>
          this.Alerter.success(
            this.$translate.instant('domain_tab_REDIRECTION_delete_success'),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_REDIRECTION_delete_fail'),
            err,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => {
          this.loading = false;
          this.$scope.resetAction();
          this.$rootScope.$broadcast('domain.tabs.redirection.load', true);
        });
    }
  },
);
