import filter from 'lodash/filter';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import map from 'lodash/map';
import size from 'lodash/size';
import trim from 'lodash/trim';
import uniq from 'lodash/uniq';

angular.module('App').controller(
  'DomainsToCsvCtrl',
  class DomainsToCsvCtrl {
    /* @ngInject */
    constructor(
      $scope,
      $rootScope,
      $q,
      $translate,
      atInternet,
      Domain,
      exportCsv,
    ) {
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$q = $q;
      this.$translate = $translate;
      this.Domain = Domain;
      this.exportCsv = exportCsv;
      this.atInternet = atInternet;
    }

    $onInit() {
      this.exportResults = {
        data: null,
        success: false,
        error: false,
      };
      this.exportStatus = {
        instanceName: 'domain.csv.export',
        doing: false,
        done: 0,
        total: 0,
      };
      this.csvExportOptions = [
        {
          label: 'service_name',
          modelKey: 'domain',
          mustBeDisabled: true,
          checked: true,
        },
        {
          label: 'service_display_name',
          modelKey: 'displayName',
          checked: true,
        },
        {
          label: 'nic_owner',
          modelKey: 'owner',
          target: 'owner',
          checked: true,
          transform: (value) => {
            const hasOrganisationName = isEmpty(
              get(value, 'organisationName', ''),
            );
            const ownerDetails = `${value?.firstName} ${value?.lastName}, ${value?.address?.city}, ${value?.address?.zip}, ${value?.address?.country}, ${value?.phone}, ${value?.email}`;
            if (hasOrganisationName && value?.legalForm === 'individual') {
              return trim(ownerDetails);
            }
            return trim(`${value?.organisationName}, ${ownerDetails}`);
          },
        },
        { label: 'creation_date', modelKey: 'creation', checked: false },
        { label: 'expiration_date', modelKey: 'expiration', checked: true },
        {
          label: 'whois_fields',
          modelKey: 'owo',
          checked: false,
          target: 'owo',
          transform: (value, translations) =>
            size(value) ? translations.enabled : translations.disabled,
        },
        {
          label: 'dnssec',
          modelKey: 'dnssec',
          checked: false,
          target: 'dnssec',
          transform: (value, translations) =>
            isString(get(value, 'status')) ? translations[value.status] : '',
        },
        {
          label: 'dnsanycast',
          modelKey: 'dnsanycast',
          checked: false,
          target: 'dnsanycast',
          transform: (value, translations) =>
            isString(get(value, 'status')) ? translations[value.status] : '',
        },
        { label: 'nic_billing', modelKey: 'contactBilling', checked: true },
        { label: 'nic_tech', modelKey: 'contactTech', checked: true },
        { label: 'nic_admin', modelKey: 'contactAdmin', checked: true },
        {
          label: 'dns',
          modelKey: 'dns',
          checked: true,
          target: 'dns',
          transform: (dnsList) => map(dnsList, 'host').join(', '),
        },
      ];

      this.$scope.$on('domain.csv.export.doing', (evt, data) => {
        this.exportStatus.doing = true;

        if (data?.total) {
          this.exportStatus.done = data.done;
          this.exportStatus.total = data.total;
        }
      });
      this.$scope.$on('domain.csv.export.done', (evt, data) => {
        this.exportStatus.doing = false;
        this.exportResults.data = data;
        this.exportResults.success = true;
      });
      this.$scope.$on('domain.csv.export.error', () => {
        this.exportStatus.doing = false;
        this.exportResults.error = true;
      });

      this.$scope.closeExport = () => this.closeExport();
      this.$scope.exportAccounts = () => this.exportAccountsToCsv();
    }

    /**
     * Export Accounts to CSV file
     */
    exportAccountsToCsv() {
      this.atInternet.trackClick({
        name: 'this.web::domain::::pop-up::button::export-domains-csv',
        type: 'action',
      });

      const choices = filter(this.csvExportOptions, (opt) => opt.checked);
      const header = map(choices, (opt) =>
        this.$translate.instant(
          `domains_action_export_csv_form_${opt.label}_label`,
        ),
      );
      const requestsNeeded = uniq(
        map(
          filter(choices, (opt) => opt.target),
          (opt) => opt.target,
        ),
      );

      this.Domain.getDomains()
        .then((zones) => {
          this.canceler = false;
          this.exportCsv.wroughtDataForCsv({
            instanceName: 'domain.csv.export',
            internalData: {
              zones,
              total: zones.length,
              datas: [header],
              translations: {
                disabled: this.$translate.instant('common_desactivated'),
                enabled: this.$translate.instant('common_activated'),
                enableInProgress: this.$translate.instant(
                  'domains_dashboard_table_dnssec_status_ENABLE_IN_PROGRESS',
                ),
                disableInProgress: this.$translate.instant(
                  'domains_dashboard_table_dnssec_status_DISABLE_IN_PROGRESS',
                ),
              },
              choices,
              requestsNeeded,
            },
            iterator: (options) => {
              const zone = options.zones.shift();

              return this.Domain.getDetails(zone, requestsNeeded).then(
                (domain) => {
                  if (domain) {
                    const data = map(options.choices, (opt) =>
                      opt.transform
                        ? opt.transform(
                            domain[opt.modelKey],
                            options.translations,
                          )
                        : domain[opt.modelKey],
                    );
                    options.datas.push(data);
                  }
                },
              );
            },
            notify: (options) =>
              this.$scope.$emit('domain.csv.export.doing', {
                done: options.total - options.zones.length,
                total: options.total,
              }),
            keepGoing: (options) =>
              this.$q.when(!isEmpty(get(options, 'zones')) && !this.canceler),
            done: (options) => {
              if (this.canceler) {
                this.atInternet.trackClick({
                  name: 'web::domain::::::listing::export-csv::cancel',
                  type: 'action',
                });
                this.$rootScope.$broadcast('domain.csv.export.cancel');
              } else {
                const data = this.exportCsv.exportData({
                  separator: ';',
                  fileName: null,
                  datas: options.datas,
                });
                this.atInternet.trackClick({
                  name: 'web::domain::::::listing::export-csv::done',
                  type: 'action',
                });
                this.$rootScope.$broadcast('domain.csv.export.done', data);
              }
            },
            error: (err) => {
              this.atInternet.trackClick({
                name: 'web::domain::::::listing::export-csv::error',
                type: 'action',
              });
              this.$rootScope.$broadcast('domain.csv.export.error', err);
            },
          });
        })
        .catch((err) =>
          this.$rootScope.$broadcast('domain.csv.export.error', err),
        );

      this.$scope.$emit('domain.csv.export.doing');
    }

    closeExport() {
      this.canceler = true;
      this.atInternet.trackClick({
        name: 'web::domain::::pop-up::button::export-domains-csv::cancel',
        type: 'action',
      });
      this.$scope.resetAction();
    }
  },
);
