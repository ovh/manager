angular.module('managerApp').controller(
  'GroupConsumptionPieChartCtrl',
  function GroupConsumptionPieChartCtrl($scope, $translatePartialLoader, $translate) {
    const self = this;

    this.loading = {
      translations: true,
    };

    this.setDataset = function (dataset) {
      self.dataset = dataset;
    };

    this.getTotal = function () {
      return _.sum(self.dataset, set => set.count);
    };

    this.$onInit = function () {
      $translatePartialLoader.addPart('../components/telecom/telephony/group/consumption/pie-chart');
      return $translate.refresh().finally(() => {
        self.loading.translations = false;
      });
    };
  },
);
