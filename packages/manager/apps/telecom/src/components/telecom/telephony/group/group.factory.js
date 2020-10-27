import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import flatten from 'lodash/flatten';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import startsWith from 'lodash/startsWith';
import valuesIn from 'lodash/valuesIn';

import {
  CALLED_FEES_PREFIX,
  GROUP_REPAYMENTS_PREFIX,
} from '../../../../app/telecom/telephony/alias/special/repayments/repayments.constants';

export default /* @ngInject */ (
  $q,
  OvhApiTelephony,
  TelephonyGroupLine,
  TelephonyGroupNumber,
  TelephonyGroupFax,
  OvhApiOrder,
) => {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function TelephonyGroup(optionsParam) {
    let options = optionsParam;

    if (!options) {
      options = {};
    }

    // options check
    if (!options.billingAccount) {
      throw new Error(
        'billingAccount option must be specified when creating a new TelephonyGroup',
      );
    }

    // mandatory
    this.billingAccount = options.billingAccount.toLowerCase();

    // from API
    this.description = options.description;
    this.status = options.status;
    this.allowedOutplan = options.allowedOutplan;
    this.securityDeposit = options.securityDeposit;
    this.creditThreshold = options.creditThreshold;
    this.currentOutplan = options.currentOutplan;

    // custom
    this.inEdition = false;
    this.saveForEdition = null;
    this.availableOrders = null;
    this.calledFees = null;
    this.groupRepayments = null;

    // lines
    this.lines = [];
    this.numbers = [];
    this.fax = [];
    if (options.lines) {
      this.initLines(options.lines);
    }
    if (options.numbers) {
      this.initNumbers(options.numbers);
    }
    if (options.fax) {
      this.initFax(options.fax);
    }
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  TelephonyGroup.prototype.getDisplayedName = function getDisplayedName() {
    const self = this;

    return self.description || self.billingAccount;
  };

  TelephonyGroup.prototype.getService = function getService(serviceName) {
    const self = this;

    return (
      self.getLine(serviceName) ||
      self.getNumber(serviceName) ||
      self.getFax(serviceName)
    );
  };

  TelephonyGroup.prototype.getAllServices = function getAllServices() {
    const self = this;
    const allServices = self.lines.concat(self.numbers, self.fax);

    return allServices;
  };

  /* ----------  API CALLS  ----------*/

  TelephonyGroup.prototype.save = function save() {
    const self = this;

    return OvhApiTelephony.v6().edit(
      {
        billingAccount: self.billingAccount,
      },
      {
        description: self.description,
      },
    ).$promise;
  };

  /* ----------  LINES  ----------*/

  TelephonyGroup.prototype.initLines = function initLines(lineOptions) {
    const self = this;

    if (isArray(lineOptions)) {
      angular.forEach(lineOptions, (lineOption) => {
        self.addLine(lineOption);
      });
    }

    return self.lines;
  };

  TelephonyGroup.prototype.addLine = function addLine(lineOptions) {
    const self = this;

    const line = new TelephonyGroupLine(
      angular.extend(lineOptions || {}, {
        billingAccount: self.billingAccount,
      }),
    );

    self.lines.push(line);

    return line;
  };

  TelephonyGroup.prototype.getLine = function getLine(lineServiceName) {
    const self = this;

    return find(self.lines, {
      serviceName: lineServiceName,
    });
  };

  /* ----------  NUMBERS  ----------*/

  TelephonyGroup.prototype.initNumbers = function initNumbers(numberOptions) {
    const self = this;

    if (isArray(numberOptions)) {
      angular.forEach(numberOptions, (numberOpts) => {
        self.addNumber(numberOpts);
      });
    }

    return self.numbers;
  };

  TelephonyGroup.prototype.addNumber = function addNumber(numberOptions) {
    const self = this;

    const number = new TelephonyGroupNumber(
      angular.extend(numberOptions, {
        billingAccount: self.billingAccount,
      }),
    );

    self.numbers.push(number);

    return number;
  };

  TelephonyGroup.prototype.getNumber = function getNumber(numberServiceName) {
    const self = this;

    return find(self.numbers, {
      serviceName: numberServiceName,
    });
  };

  TelephonyGroup.prototype.fetchService = function fetchService(serviceName) {
    const self = this;
    let number;

    // TODO : handle when service is not an alias
    return OvhApiTelephony.Number()
      .v6()
      .get({
        billingAccount: self.billingAccount,
        serviceName,
      })
      .$promise.then((numberOptions) => {
        number = new TelephonyGroupNumber(
          angular.extend(numberOptions, {
            billingAccount: self.billingAccount,
          }),
        );

        if (self.getNumber(number.serviceName)) {
          self.numbers.splice(
            findIndex(
              self.numbers,
              (n) => n.serviceName === number.serviceName,
            ),
            1,
            number,
          );
        } else {
          self.addNumber(number);
        }

        return number;
      });
  };

  /* ----------  REPAYMENT CONSUMPTION  ----------*/

  TelephonyGroup.prototype.getRepaymentConsumption = function getRepaymentConsumption() {
    const self = this;

    return OvhApiTelephony.Service()
      .RepaymentConsumption()
      .Aapi()
      .repayment({
        billingAccount: self.billingAccount,
      })
      .$promise.then((consumptions) => {
        const calledFeesPrefix = flatten(valuesIn(CALLED_FEES_PREFIX));

        const groupRepaymentsPrefix = flatten(
          valuesIn(GROUP_REPAYMENTS_PREFIX),
        );

        self.calledFees = flatten(
          map(calledFeesPrefix, (prefix) =>
            filter(
              consumptions,
              (consumption) =>
                startsWith(consumption.dialed, prefix) &&
                consumption.price !== 0 &&
                moment(consumption.creationDatetime).isAfter(
                  moment()
                    .subtract(60, 'days')
                    .format(),
                ),
            ),
          ),
        );

        self.groupRepayments = {
          all: consumptions,
          raw: flatten(
            map(groupRepaymentsPrefix, (prefix) =>
              filter(
                consumptions,
                (consumption) =>
                  startsWith(consumption.dialed, prefix) &&
                  consumption.price !== 0,
              ),
            ),
          ),
        };

        return self;
      });
  };

  /* ----------  FAX  ----------*/

  TelephonyGroup.prototype.initFax = function initFax(faxOptionsList) {
    const self = this;

    if (isArray(faxOptionsList)) {
      angular.forEach(faxOptionsList, (faxOptions) => {
        self.addFax(faxOptions);
      });
    }

    return self.fax;
  };

  TelephonyGroup.prototype.addFax = function addFax(faxOptions) {
    const self = this;

    const fax = new TelephonyGroupFax(
      angular.extend(faxOptions, {
        billingAccount: self.billingAccount,
      }),
    );

    self.fax.push(fax);

    return fax;
  };

  TelephonyGroup.prototype.getFax = function getFax(faxServiceName) {
    const self = this;

    return find(self.fax, {
      serviceName: faxServiceName,
    });
  };

  /* ----------  EDITION  ----------*/

  TelephonyGroup.prototype.startEdition = function startEdition() {
    const self = this;

    self.inEdition = true;

    self.saveForEdition = {
      description: angular.copy(self.description),
    };

    return self;
  };

  TelephonyGroup.prototype.stopEdition = function stopEdition(cancel) {
    const self = this;

    if (self.saveForEdition && cancel) {
      self.description = angular.copy(self.saveForEdition.description);
    }

    self.saveForEdition = null;
    self.inEdition = false;

    return self;
  };

  /* ----------  ORDERS  ----------*/

  TelephonyGroup.prototype.getAvailableOrderNames = function getAvailableOrderNames() {
    const self = this;

    if (self.availableOrders) {
      return $q.when(self.availableOrders);
    }
    return OvhApiOrder.Telephony()
      .v6()
      .get({
        billingAccount: self.billingAccount,
      })
      .$promise.then(
        (orderNames) => {
          self.availableOrders = orderNames;
          return orderNames;
        },
        (error) => {
          if (error.status === 404) {
            self.availableOrders = [];
            return self.availableOrders;
          }
          return $q.reject(error);
        },
      );
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return TelephonyGroup;
};
