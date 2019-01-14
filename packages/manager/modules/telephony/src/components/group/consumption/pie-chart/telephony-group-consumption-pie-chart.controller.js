import _ from 'lodash';

export default /* @ngInject */ function GroupConsumptionPieChartCtrl() {
  const self = this;

  this.loading = {
    translations: true,
  };

  this.setDataset = function setDataset(dataset) {
    self.dataset = dataset;
  };

  this.getTotal = function getTotal() {
    return _.sum(self.dataset, set => set.count);
  };

  /*
  this.$onInit = function () {
    $translatePartialLoader.addPart('../components/telecom/telephony/group/consumption/pie-chart');
    return $translate.refresh().finally(() => {
      self.loading.translations = false;
    });
  };
  */
}
