angular.module('controllers').controller(
  'controllers.Domain.Glue.AddOrEdit',
  class DomainGlueAddOrEditCtrl {
    constructor($scope, $translate, Alerter, Domain, WucValidator) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
      this.WucValidator = WucValidator;
    }

    $onInit() {
      this.domain = angular.copy(this.$scope.currentActionData.domain);
      this.editedGlueRecord = _.get(
        this.$scope.currentActionData,
        'editedGlueRecord',
        null,
      );
      this.editMode = !!this.editedGlueRecord;

      this.loading = false;
      this.model = {};

      // edit mode
      if (this.editMode) {
        _.set(
          this.model,
          'host',
          this.editedGlueRecord.host.replace(`.${this.domain.name}`, ''),
        );
        _.set(this.model, 'ips', this.editedGlueRecord.ips.toString());
      }

      this.$scope.addOrEditGlueRecord = () => this.addOrEditGlueRecord();
    }

    getModelFormatted() {
      return {
        host: `${this.model.host}.${this.domain.name}`,
        ips: this.model.ips
          ? _.uniq(_.map(this.model.ips.replace(/,\s*$/, '').split(','), ip => _.trim(ip)))
          : [],
      };
    }

    hostCheck(input) {
      input.$setValidity(
        'host',
        this.WucValidator.isValidSubDomain(this.model.host),
      );
    }

    ipsCheck(input) {
      let valid;
      const model = this.getModelFormatted();

      if (!this.domain.glueRecordMultiIpSupported && model.ips.length > 1) {
        valid = false;
      } else {
        valid = !_.isEmpty(model.ips)
          && _.every(
            model.ips,
            ip => this.WucValidator.isValidIpv4(ip)
              || (_.get(this.domain, 'glueRecordIpv6Supported', false)
                && this.WucValidator.isValidIpv6(ip)),
          );
      }

      input.$setValidity('ips', valid);
    }

    addOrEditGlueRecord() {
      this.loading = true;
      let promise;

      if (this.editMode) {
        promise = this.Domain.editGlueRecord(
          this.domain.name,
          `${this.model.host}.${this.domain.name}`,
          this.getModelFormatted(),
        );
      } else {
        promise = this.Domain.addGlueRecord(
          this.domain.name,
          this.getModelFormatted(),
        );
      }

      return promise
        .then(() => this.Alerter.success(
          this.$translate.instant(this.editMode
            ? 'domain_tab_GLUE_modify_success'
            : 'domain_tab_GLUE_add_success'),
          this.$scope.alerts.main,
        ))
        .catch(err => this.Alerter.alertFromSWS(
          this.$translate.instant(this.editMode
            ? 'domain_tab_GLUE_modify_error'
            : 'domain_tab_GLUE_add_error'),
          err,
          this.$scope.alerts.main,
        ))
        .finally(() => {
          this.loading = false;
          this.$scope.resetAction();
        });
    }
  },
);
