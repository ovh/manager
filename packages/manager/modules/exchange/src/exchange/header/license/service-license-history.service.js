angular.module('Module.exchange.services').service(
  'exchangeHeaderLicence',
  class ExchangeHeaderLicence {
    constructor(exchangeAccountTypes, OvhHttp, $translate) {
      this.exchangeAccountTypes = exchangeAccountTypes;
      this.OvhHttp = OvhHttp;
      this.$translate = $translate;

      this.PERIODS = {
        LAST_WEEK: {
          displayValue: $translate.instant('exchange_action_license_history_period_LASTWEEK'),
          date: moment()
            .subtract(1, 'weeks')
            .utc()
            .format(),
        },
        LAST_MONTH: {
          displayValue: $translate.instant('exchange_action_license_history_period_LASTMONTH'),
          date: moment()
            .subtract(1, 'months')
            .utc()
            .format(),
        },
        LAST_3_MONTHS: {
          displayValue: $translate.instant('exchange_action_license_history_period_LAST3MONTHS'),
          date: moment()
            .subtract(3, 'months')
            .utc()
            .format(),
        },
        LAST_YEAR: {
          displayValue: $translate.instant('exchange_action_license_history_period_LASTYEAR'),
          date: moment()
            .subtract(1, 'years')
            .utc()
            .format(),
        },
      };
    }

    fetchLicences(organizationName, exchangeService, startingDate) {
      return this.OvhHttp.get(
        `/email/exchange/${organizationName}/service/${exchangeService}/license`,
        {
          rootPath: 'apiv6',
          params: {
            fromDate: startingDate,
            toDate: moment()
              .utc()
              .format(),
          },
        },
      )
        .then(licenses => ({
          maxValue: _.max(
            _(licenses)
              .map('outlookQuantity')
              .value()
              .concat(
                _(licenses)
                  .map(
                    license => _(license.accountLicense)
                      .filter({ license: 'standard' })
                      .value()[0].licenseQuantity,
                  )
                  .value(),
              )
              .concat(
                _(licenses)
                  .map(
                    license => _(license.accountLicense)
                      .filter({ license: 'basic' })
                      .value()[0].licenseQuantity,
                  )
                  .value(),
              )
              .concat(
                _(licenses)
                  .map(
                    license => _(license.accountLicense)
                      .filter({ license: 'enterprise' })
                      .value()[0].licenseQuantity,
                  )
                  .value(),
              ),
          ),
          outlook: _(licenses)
            .map(license => ({
              x: ExchangeHeaderLicence.getDate(license.date),
              y: license.outlookQuantity,
            }))
            .value(),
          standard: _(licenses)
            .map(license => ({
              x: ExchangeHeaderLicence.getDate(license.date),
              y: _(license.accountLicense)
                .filter({ license: 'standard' })
                .value()[0].licenseQuantity,
            }))
            .value(),
          basic: _(licenses)
            .map(license => ({
              x: ExchangeHeaderLicence.getDate(license.date),
              y: _(license.accountLicense)
                .filter({ license: 'basic' })
                .value()[0].licenseQuantity,
            }))
            .value(),
          enterprise: _(licenses)
            .map(license => ({
              x: ExchangeHeaderLicence.getDate(license.date),
              y: _(license.accountLicense)
                .filter({ license: 'enterprise' })
                .value()[0].licenseQuantity,
            }))
            .value(),
        }))
        .then((formattedLicenses) => {
          if (!this.exchangeAccountTypes.CAN_DO.BASIC()) {
            delete formattedLicenses.basic; // eslint-disable-line
          }

          if (!this.exchangeAccountTypes.CAN_DO.ENTERPRISE()) {
            delete formattedLicenses.enterprise; // eslint-disable-line
          }

          return formattedLicenses;
        });
    }

    static getDate(date) {
      const formattedDate = moment(date);

      return Date.UTC(formattedDate.year(), formattedDate.month(), formattedDate.date());
    }
  },
);
