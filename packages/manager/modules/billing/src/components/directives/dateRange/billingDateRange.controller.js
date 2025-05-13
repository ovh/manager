import head from 'lodash/head';
import set from 'lodash/set';

export default /* @ngInject */ function BillingDateRangeController(
  $timeout,
  $translate,
  BillingdateRangeSelection,
) {
  this.today = moment()
    .endOf('day')
    .toISOString();
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

  this.onDateRangeChange = ([dateFrom, dateTo]) => {
    set(BillingdateRangeSelection, 'dateFrom', moment(dateFrom).startOf('day'));
    if (
      moment(BillingdateRangeSelection.dateFrom).isAfter(
        BillingdateRangeSelection.dateTo,
      )
    ) {
      set(
        BillingdateRangeSelection,
        'dateTo',
        BillingdateRangeSelection.dateFrom.endOf('day'),
      );
    }

    set(BillingdateRangeSelection, 'dateTo', moment(dateTo).endOf('day'));
    if (
      moment(BillingdateRangeSelection.dateTo).isBefore(
        BillingdateRangeSelection.dateFrom,
      )
    ) {
      set(
        BillingdateRangeSelection,
        'dateFrom',
        BillingdateRangeSelection.dateTo.startOf('day'),
      );
    }

    this.triggerChangeHandler();
    this.updateCustomDateRange();
  };

  this.updateCustomDateRange = () => {
    this.customDateRangeModel = [
      moment(BillingdateRangeSelection.dateFrom).toISOString(),
      moment(BillingdateRangeSelection.dateTo).toISOString(),
    ];
  };

  this.onPresetBtn = (preset) => {
    set(BillingdateRangeSelection, 'mode', preset.id);
    this.applyPreset(preset);
    this.triggerChangeHandler();
  };

  this.applyPreset = (preset) => {
    set(
      BillingdateRangeSelection,
      'dateFrom',
      moment()
        .subtract(...preset.args)
        .startOf(preset.startOf),
    );

    set(BillingdateRangeSelection, 'dateTo', moment().endOf('day'));

    this.updateCustomDateRange();
  };

  this.onCustomRangeBtn = () => {
    set(BillingdateRangeSelection, 'mode', this.CUSTOM_RANGE_MODE);
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

    let preset = _self.presets.find(
      (_preset) => _preset.id === BillingdateRangeSelection.mode,
    );
    if (!preset) {
      preset = head(_self.presets);
      set(BillingdateRangeSelection, 'mode', preset.id);
    }

    _self.applyPreset(preset);
  })(this);
}
