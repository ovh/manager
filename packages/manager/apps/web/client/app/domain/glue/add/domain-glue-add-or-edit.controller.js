import every from 'lodash/every';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import set from 'lodash/set';
import trim from 'lodash/trim';
import uniq from 'lodash/uniq';

angular.module('controllers').controller(
  'controllers.Domain.Glue.AddOrEdit',
  class DomainGlueAddOrEditCtrl {
    /* @ngInject */
    constructor($scope, $translate, Alerter, Domain, WucValidator) {
      this.$scope = $scope;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
      this.WucValidator = WucValidator;
    }

    $onInit() {
      this.domain = angular.copy(this.$scope.currentActionData.domain);
      this.editedGlueRecord = get(
        this.$scope.currentActionData,
        'editedGlueRecord',
        null,
      );
      this.editMode = !!this.editedGlueRecord;

      this.loading = false;
      this.model = {};

      // edit mode
      if (this.editMode) {
        set(
          this.model,
          'host',
          this.editedGlueRecord.host.replace(`.${this.domain.name}`, ''),
        );
        set(this.model, 'ips', this.editedGlueRecord.ips.toString());
      }

      this.$scope.addOrEditGlueRecord = () => this.addOrEditGlueRecord();
    }

    getModelFormatted() {
      return {
        host: `${this.model.host}.${this.domain.name}`,
        ips: this.model.ips
          ? uniq(
              map(this.model.ips.replace(/,\s*$/, '').split(','), (ip) =>
                trim(ip),
              ),
            )
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
        valid =
          !isEmpty(model.ips) &&
          every(
            model.ips,
            (ip) =>
              this.WucValidator.isValidIpv4(ip) ||
              (get(this.domain, 'glueRecordIpv6Supported', false) &&
                this.WucValidator.isValidIpv6(ip)),
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
        .then(() =>
          this.Alerter.success(
            this.$translate.instant(
              this.editMode
                ? 'domain_tab_GLUE_modify_success'
                : 'domain_tab_GLUE_add_success',
            ),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant(
              this.editMode
                ? 'domain_tab_GLUE_modify_error'
                : 'domain_tab_GLUE_add_error',
            ),
            err,
            this.$scope.alerts.main,
          ),
        )
        .finally(() => {
          this.loading = false;
          this.$scope.resetAction();
        });
    }
  },
);
