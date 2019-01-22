import _ from 'lodash';

export default /* @ngInject */ function GroupConsumptionPieChartCtrl() {
  const self = this;

  this.loading = {
    translations: false,
  };

  this.setDataset = function setDataset(dataset) {
    self.dataset = dataset;
  };

  this.getTotal = function getTotal() {
    return _.sum(self.dataset, set => set.count);
  };
}
