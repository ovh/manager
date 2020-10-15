import sumBy from 'lodash/sumBy';

export default /* @ngInject */ function GroupConsumptionPieChartCtrl(
  $scope,
  $translatePartialLoader,
  $translate,
) {
  const self = this;

  this.loading = {
    translations: true,
  };

  this.setDataset = function setDataset(dataset) {
    self.dataset = dataset;
  };

  this.getTotal = function getTotal() {
    return sumBy(self.dataset, (set) => set.count);
  };

  this.$onInit = function $onInit() {
    $translatePartialLoader.addPart(
      '../components/telecom/telephony/group/consumption/pie-chart',
    );
    return $translate.refresh().finally(() => {
      self.loading.translations = false;
    });
  };
}
