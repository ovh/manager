import { CALENDAR_UPDATE_DELAY_MS } from './voip-consumption.constant.js';

export default class BillingVoipConsumptionsCtrl {
  /* @ngInject */
  constructor($timeout, BillingVoipConsumptionService, ouiDatagridService) {
    this.$timeout = $timeout;
    this.BillingVoipConsumptionService = BillingVoipConsumptionService;
    this.ouiDatagridService = ouiDatagridService;
    this.availableDates = [];
    this.selectedDate = null;
    this.availableDatesLoading = true;
  }

  loadBillingAccount($config) {
    return this.BillingVoipConsumptionService.getBillingAccount($config);
  }

  loadHistoryConsumption({ billingAccount }) {
    this.availableDatesLoading = true;
    return this.BillingVoipConsumptionService.getHistoryConsumption(billingAccount).then((consumption) => {
      // for removing duplicates dates
      this.availableDates = [...new Set([...this.availableDates, ...consumption.map(({ date }) => date)])].sort((a, b) => new Date(b) - new Date(a));
      this.selectedDate = this.selectedDate || this.availableDates[0];
      return consumption.find((({ date }) => date === this.selectedDate)) || { price: { text: null }, priceOutplan: { text: null } };
    }).finally(() => {
      // Because the enable date for the calendar is one time binding
      return this.$timeout(() => {
        this.availableDatesLoading = false;
      }, CALENDAR_UPDATE_DELAY_MS);
    });
  }

  downloadFile({ billingAccount }, extension) {
    return this.BillingVoipConsumptionService.getHistoryConsumptionFile(billingAccount, this.selectedDate, { extension }).then(({ url }) => {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = '';
      link.click();
    });
  }

  refreshDatagrid(datagridId, showSpinner) {
    this.ouiDatagridService.refresh(datagridId, showSpinner);
  }
}
