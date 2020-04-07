import concat from 'lodash/concat';
import filter from 'lodash/filter';
import get from 'lodash/get';
import head from 'lodash/head';
import map from 'lodash/map';
import max from 'lodash/max';
import 'moment';

export default class ExchangeHeaderLicence {
  /* @ngInject */
  constructor(exchangeAccountTypes, OvhHttp, $translate) {
    this.exchangeAccountTypes = exchangeAccountTypes;
    this.OvhHttp = OvhHttp;
    this.$translate = $translate;

    this.PERIODS = {
      LAST_WEEK: {
        displayValue: $translate.instant(
          'exchange_action_license_history_period_LASTWEEK',
        ),
        date: moment()
          .subtract(1, 'weeks')
          .utc()
          .format(),
      },
      LAST_MONTH: {
        displayValue: $translate.instant(
          'exchange_action_license_history_period_LASTMONTH',
        ),
        date: moment()
          .subtract(1, 'months')
          .utc()
          .format(),
      },
      LAST_3_MONTHS: {
        displayValue: $translate.instant(
          'exchange_action_license_history_period_LAST3MONTHS',
        ),
        date: moment()
          .subtract(3, 'months')
          .utc()
          .format(),
      },
      LAST_YEAR: {
        displayValue: $translate.instant(
          'exchange_action_license_history_period_LASTYEAR',
        ),
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
      .then((licenses) => ({
        maxValue: max(
          concat(
            map(licenses, 'outlookQuantity'),
            map(licenses, (license) =>
              get(
                head(filter(license.accountLicense, { license: 'standard' })),
                'licenseQuantity',
              ),
            ),
            map(licenses, (license) =>
              get(
                head(filter(license.accountLicense, { license: 'basic' })),
                'licenseQuantity',
              ),
            ),
            map(licenses, (license) =>
              get(
                head(filter(license.accountLicense, { license: 'enterprise' })),
                'licenseQuantity',
              ),
            ),
          ),
        ),
        outlook: map(licenses, (license) => ({
          x: ExchangeHeaderLicence.getDate(license.date),
          y: license.outlookQuantity,
        })),
        standard: map(licenses, (license) => ({
          x: ExchangeHeaderLicence.getDate(license.date),
          y: get(
            head(filter(license.accountLicense, { license: 'standard' })),
            'licenseQuantity',
          ),
        })),
        basic: map(licenses, (license) => ({
          x: ExchangeHeaderLicence.getDate(license.date),
          y: get(
            head(filter(license.accountLicense, { license: 'basic' })),
            'licenseQuantity',
          ),
        })),
        enterprise: map(licenses, (license) => ({
          x: ExchangeHeaderLicence.getDate(license.date),
          y: get(
            head(filter(license.accountLicense, { license: 'enterprise' })),
            'licenseQuantity',
          ),
        })),
      }))
      .then((formattedLicenses) => {
        if (!this.exchangeAccountTypes.CAN_DO.BASIC()) {
          // eslint-disable-next-line no-param-reassign
          delete formattedLicenses.basic;
        }

        if (!this.exchangeAccountTypes.CAN_DO.ENTERPRISE()) {
          // eslint-disable-next-line no-param-reassign
          delete formattedLicenses.enterprise;
        }

        return formattedLicenses;
      });
  }

  static getDate(date) {
    const formattedDate = moment(date);

    return Date.UTC(
      formattedDate.year(),
      formattedDate.month(),
      formattedDate.date(),
    );
  }
}
