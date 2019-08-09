angular.module('Billing.directives').controller('Billing.directives.billingDateRangeCtrl', function ($timeout, $translate, BillingdateRangeSelection) {
  this.today = moment();
  this.CUSTOM_RANGE_MODE = 'custom';
  this.model = {};
  this.dateRangeSelection = BillingdateRangeSelection;

  this.presets = [
    {
      id: '3M',
      label: $translate.instant('common_time_period_in_months', {
        t0: 3,
      }),
      args: [3, 'months'],
      startOf: 'month',
    },
    {
      id: '6M',
      label: $translate.instant('common_time_period_in_months', {
        t0: 6,
      }),
      args: [6, 'months'],
      startOf: 'month',
    },
    {
      id: '1Y',
      label: $translate.instant('common_time_period_one_year'),
      args: [1, 'years'],
      startOf: 'month',
    },
  ];

  this.dateFromChanged = ({ dateFrom }) => {
    _.set(BillingdateRangeSelection, 'dateFrom', moment(dateFrom).startOf('day'));
    if (moment(BillingdateRangeSelection.dateFrom).isAfter(BillingdateRangeSelection.dateTo)) {
      _.set(BillingdateRangeSelection, 'dateTo', BillingdateRangeSelection.dateFrom.endOf('day'));
    }
    this.triggerChangeHandler();
  };

  this.dateToChanged = ({ dateTo }) => {
    _.set(BillingdateRangeSelection, 'dateTo', moment(dateTo).endOf('day'));
    if (moment(BillingdateRangeSelection.dateTo).isBefore(BillingdateRangeSelection.dateFrom)) {
      _.set(BillingdateRangeSelection, 'dateFrom', BillingdateRangeSelection.dateTo.startOf('day'));
    }
    this.triggerChangeHandler();
  };

  this.onPresetBtn = (preset) => {
    _.set(BillingdateRangeSelection, 'mode', preset.id);
    this.applyPreset(preset);
    this.triggerChangeHandler();
  };

  this.applyPreset = (preset) => {
    _.set(BillingdateRangeSelection, 'dateFrom', moment()
      .subtract(...preset.args)
      .startOf(preset.startOf));

    _.set(BillingdateRangeSelection, 'dateTo', moment().endOf('day'));
  };

  this.onCustomRangeBtn = () => {
    _.set(BillingdateRangeSelection, 'mode', this.CUSTOM_RANGE_MODE);
  };

  this.triggerChangeHandler = () => {
    if (angular.isFunction(this.onChange)) {
      $timeout(() => {
        this.onChange(BillingdateRangeSelection);
      });
    }
  };

  /**
   * Initialisation
   */
  (function init(_self) {
    if (BillingdateRangeSelection.mode === _self.CUSTOM_RANGE_MODE) {
      return;
    }

    let preset = _self.presets.find(_preset => _preset.id === BillingdateRangeSelection.mode);
    if (!preset) {
      preset = _.first(_self.presets);
      _.set(BillingdateRangeSelection, 'mode', preset.id);
    }

    _self.applyPreset(preset);
  }(this));
});
