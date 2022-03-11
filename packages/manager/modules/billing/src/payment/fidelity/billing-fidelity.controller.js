export default class {
  /* @ngInject */
  constructor(
    $filter,
    $scope,
    $timeout,
    $translate,
    BillingFidelity,
    BillingmessageParser,
    BillingdateRangeSelection,
    coreConfig,
  ) {
    this.$filter = $filter;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.BillingFidelity = BillingFidelity;
    this.BillingmessageParser = BillingmessageParser;
    this.BillingdateRangeSelection = BillingdateRangeSelection;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.fidelityLoading = false;
    this.fidelityAccountLoading = false;
    this.fidelityAccount = null;
    this.showCustomRangeDate = false;
    this.currency = null;
    this.today = moment();

    // Set items count by page
    this.itemsPerPage = 10;
    this.tasksId = [];
    this.tasksDetails = [];

    this.loaders = {
      tasks: true,
    };

    this.currency = this.coreConfig.getUser().currency;
    this.dateFrom = this.BillingdateRangeSelection.dateFrom;
    this.dateTo = this.BillingdateRangeSelection.dateTo;
    return this.getFidelityAccount();
  }

  getMovements({ offset, pageSize }) {
    return this.BillingFidelity.getMovements(
      this.BillingdateRangeSelection.dateFrom,
      this.BillingdateRangeSelection.dateTo,
    ).then((movements) => ({
      data: movements
        .reverse()
        .slice(offset - 1, offset + pageSize - 1)
        .map((movementId) => ({
          movementId,
        })),
      meta: {
        currentOffset: offset,
        pageCount: Math.ceil(movements.length / pageSize),
        pageSize,
        totalCount: movements.length,
      },
    }));
  }

  getMovementDetails({ movementId }) {
    return this.BillingFidelity.getMovementsDetails(movementId);
  }

  onBasicDateRangeChange(_dateFrom) {
    this.showCustomRangeDate = false;
    this.dateFrom = moment()
      .subtract(parseInt(_dateFrom, 10), 'month')
      .startOf('month');

    this.dateTo = moment();

    this.onDateRangeChange(this.dateFrom, this.dateTo);
  }

  onDateRangeChange(dateFrom, dateTo) {
    this.fidelityLoading = true;
    this.BillingdateRangeSelection.dateFrom = dateFrom;
    this.BillingdateRangeSelection.dateTo = dateTo;

    this.$timeout(() => {
      return this.getMovements({
        offset: 1,
        pageSize: this.itemsPerPage,
      }).finally(() => {
        this.fidelityLoading = false;
      });
    }, 100);
  }

  onCustomDateRangeChange([_dateFrom, _dateTo]) {
    let dateFrom;
    let dateTo;

    if (_dateFrom && _dateTo) {
      dateFrom = moment(_dateFrom).startOf('day');
      if (moment(dateFrom).isAfter(dateTo)) {
        dateTo = dateFrom.endOf('day');
      }

      dateTo = moment(_dateTo).endOf('day');
      if (moment(dateTo).isBefore(dateFrom)) {
        dateFrom = dateTo.startOf('day');
      }

      this.onDateRangeChange(dateFrom, dateTo);
    }
  }

  setMessage(message, data) {
    const msg = this.BillingmessageParser(message, data);
    this.message = msg.message;
    this.alertType = msg.alertType;
  }

  getLastUpdate(format) {
    if (this.fidelityAccount) {
      return this.$filter('date')(this.fidelityAccount.lastUpdate, format);
    }
    return '';
  }

  setAction(action, data) {
    if (action) {
      this.$scope.currentAction = action;
      this.$scope.currentActionData = data;

      this.$scope.stepPath = `billing/payment/fidelity/${this.$scope.currentAction}/billing-fidelity-${this.$scope.currentAction}.html`;
      $('#currentAction').modal({
        keyboard: true,
        backdrop: 'static',
      });
    }
  }

  getFidelityAccount() {
    this.fidelityAccountLoading = true;
    return this.BillingFidelity.getFidelityAccount()
      .then((fidelityAccount) => {
        this.fidelityAccount = fidelityAccount;
      })
      .catch((data) => {
        if (data.status !== 404) {
          this.setMessage(
            this.$translate.instant('fidelity_get_accounts_error'),
            data.data,
          );
        } else {
          this.fidelityAccount = null;
        }
      })
      .finally(() => {
        this.fidelityAccountLoading = false;
      });
  }
}
