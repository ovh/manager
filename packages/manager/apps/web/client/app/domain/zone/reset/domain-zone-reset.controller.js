import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';

angular.module('App').controller(
  'DomainZoneResetCtrl',
  class DomainZoneResetCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $q,
      $translate,
      Alerter,
      Domain,
      DomainValidator,
      WucEmails,
      Hosting,
    ) {
      this.$scope = $scope;
      this.$q = $q;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.Domain = Domain;
      this.DomainValidator = DomainValidator;
      this.WucEmails = WucEmails;
      this.Hosting = Hosting;
    }

    $onInit() {
      this.domain = this.$scope.currentActionData;

      this.aOpts = {
        custom: null,
        enum: ['REDIRECTION', 'HOSTING_WEB', 'CUSTOM'],
      };
      this.loading = false;
      this.mxOpts = {
        custom: [
          {
            target: '',
            priority: 0,
          },
        ],
        enum: ['REDIRECTION', 'EMAILS', 'CUSTOM'],
      };
      this.zoneReset = { minimized: false };

      this.$scope.resetZone = () => this.resetZone();

      this.getHostingAndEmail();
    }

    checkValidityA(input) {
      input.$setValidity(
        'ipv4',
        this.aOpts.custom === null ||
          this.aOpts.custom === '' ||
          this.DomainValidator.isValidTarget(this.aOpts.custom, 'A'),
      );
    }

    getDnsRecords(data) {
      let dnsRecords = [];

      if (data.hosting) {
        dnsRecords.push({ fieldType: 'A', target: data.hosting.hostingIp });
      }
      if (isArray(data.email) && !isEmpty(data.email)) {
        dnsRecords = dnsRecords.concat(
          map(
            data.email.filter(
              (dnsRecord) =>
                dnsRecord.fieldType === 'MX' && !dnsRecord.subDomain,
            ),
            (dnsRecord) => ({ fieldType: 'MX', target: dnsRecord.target }),
          ),
        );
      }
      if (this.aOpts.custom) {
        dnsRecords.push({ fieldType: 'A', target: this.aOpts.custom });
      }
      if (this.mxOpts.custom) {
        dnsRecords = dnsRecords.concat(
          map(
            this.mxOpts.custom.filter(
              (custom) => custom && custom.target !== '',
            ),
            (custom) => ({
              fieldType: 'MX',
              target: `${custom.priority} ${custom.target}`,
            }),
          ),
        );
      }

      return dnsRecords;
    }

    getHostingAndEmail() {
      this.loading = true;
      return this.$q
        .all({
          hostingList: this.Hosting.getHostings(),
          email: this.WucEmails.getDomain(this.domain.name).catch(() =>
            this.$q.resolve(null),
          ),
        })
        .then((data) => {
          this.hostingList = data.hostingList;
          if (data.email) {
            this.mxOpts.enum =
              data.email.offer === 'MXREDIRECT'
                ? this.mxOpts.enum.filter((enumMx) => enumMx !== 'EMAILS')
                : this.mxOpts.enum;
          } else {
            this.mxOpts.enum = this.mxOpts.enum.filter(
              (enumMx) => enumMx !== 'EMAILS',
            );
          }
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_configuration_zonedns_reset_error'),
            err,
            this.$scope.alerts.main,
          );
          this.$scope.resetAction();
        })
        .finally(() => {
          this.loading = false;
        });
    }

    resetAForm() {
      this.aOpts.custom = null;
      this.aOpts.hosting = null;
    }

    resetMxForm() {
      this.mxOpts.custom = [{ target: '', priority: 0 }];
    }

    resetZone() {
      this.loading = true;
      return this.$q
        .all({
          hosting:
            this.aOpts.type === 'HOSTING_WEB'
              ? this.Hosting.getHosting(this.aOpts.hosting)
              : this.$q.when(null),
          email:
            this.mxOpts.type === 'EMAILS'
              ? this.WucEmails.getRecommendedDNSRecords(this.domain.name)
              : this.$q.when(null),
        })
        .then((data) => {
          const dnsRecords = this.getDnsRecords(data);
          return this.Domain.resetZone(
            this.domain.name,
            this.zoneReset.minimized,
            dnsRecords.length ? dnsRecords : null,
          );
        })
        .then(() =>
          this.Alerter.success(
            this.$translate.instant(
              'domain_configuration_zonedns_reset_success',
            ),
            this.$scope.alerts.main,
          ),
        )
        .catch((err) =>
          this.Alerter.alertFromSWS(
            this.$translate.instant('domain_configuration_zonedns_reset_error'),
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
