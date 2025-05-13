export default /* @ngInject */ function BillingDateRangeSelectionService(
  $window,
) {
  const STORAGE_KEY_PREFIX = 'billingDateRangeSelection';

  function loadDateFromStorage(dateType, defaultDate) {
    let date = moment(
      $window.sessionStorage.getItem(`${STORAGE_KEY_PREFIX}_${dateType}`),
    );
    if (!date.isValid()) {
      date = moment(defaultDate);
    }
    return date;
  }

  let mode = $window.sessionStorage.getItem(`${STORAGE_KEY_PREFIX}_mode`);
  let dateFrom = loadDateFromStorage(
    'dateFrom',
    moment()
      .subtract(1, 'month')
      .startOf('month'),
  );
  let dateTo = loadDateFromStorage('dateTo', moment().endOf('day'));

  return {
    get mode() {
      return mode;
    },
    set mode(_mode_) {
      if (mode !== _mode_) {
        mode = _mode_;
        $window.sessionStorage.setItem(`${STORAGE_KEY_PREFIX}_mode`, _mode_);
      }
    },

    get dateFrom() {
      return dateFrom;
    },
    set dateFrom(_dateFrom_) {
      if (dateFrom !== _dateFrom_) {
        dateFrom = moment(_dateFrom_);
        $window.sessionStorage.setItem(
          `${STORAGE_KEY_PREFIX}_dateFrom`,
          dateFrom.toISOString(),
        );
      }
    },

    get dateTo() {
      return dateTo;
    },
    set dateTo(_dateTo_) {
      if (dateTo !== _dateTo_) {
        dateTo = moment(_dateTo_);
        $window.sessionStorage.setItem(
          `${STORAGE_KEY_PREFIX}_dateTo`,
          dateTo.toISOString(),
        );
      }
    },
  };
}
