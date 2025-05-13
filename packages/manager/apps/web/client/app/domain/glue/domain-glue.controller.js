import set from 'lodash/set';

angular.module('App').controller(
  'controllers.Domain.Glue',
  class DomainTabGlueCtrl {
    /* @ngInject */
    constructor($scope, $translate, Alerter, Domain, DomainValidator) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
      this.DomainValidator = DomainValidator;
    }

    $onInit() {
      this.domain = this.$scope.ctrlDomain.domain;
      this.loading = false;

      this.$scope.$on('domain.tabs.glue.refresh', () =>
        this.refreshTableGlues(),
      );
      this.$scope.$on('domain.DomainHostCreate.done', () => {
        this.refreshTableGlues();
        this.Alerter.resetMessage(this.$scope.alerts.main);
      });
      this.$scope.$on('domain.DomainHostDelete.done', () => {
        this.refreshTableGlues();
        this.Alerter.resetMessage(this.$scope.alerts.main);
      });
      this.$scope.$on('domain.DomainHostUpdate.done', () => {
        this.refreshTableGlues();
        this.Alerter.resetMessage(this.$scope.alerts.main);
      });
      this.$scope.$on('$destroy', () => {
        this.Domain.killPollDomainHostCreate();
        this.Domain.killPollDomainHostDelete();
        this.Domain.killPollDomainHostUpdate();
      });

      this.Domain.restartPoll(this.domain.name, [
        'DomainHostCreate',
        'DomainHostDelete',
        'DomainHostUpdate',
      ]);
      this.loadGlues();
    }

    loadGlues() {
      this.loading = true;

      return this.Domain.getGlueRecords(this.domain.name)
        .then((hosts) => {
          this.glueHosts = hosts.map((host) => ({ host }));
        })
        .catch((err) => {
          set(err, 'type', err.type || 'ERROR');
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_tab_GLUE_table_error'),
            err,
            this.$scope.alerts.main,
          );
          this.glueHosts = [];
        })
        .finally(() => {
          this.loading = false;
        });
    }

    refreshTableGlues() {
      return !this.loading && this.loadGlues();
    }

    transformItem(host) {
      return this.Domain.getGlueRecordDetail(this.domain.name, host.host).then(
        (glueRecord) => {
          set(
            glueRecord,
            'hostToDisplay',
            this.DomainValidator.constructor.convertHostToUnicode(host.host),
          );
          return glueRecord;
        },
      );
    }
  },
);
