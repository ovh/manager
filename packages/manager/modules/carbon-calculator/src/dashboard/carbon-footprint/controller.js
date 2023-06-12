export default class CarbonFootprintCtrl {
  /* @ngInject */
  constructor(carbonFootprintService) {
    this.previousMonth = carbonFootprintService.computePreviousMonth();
  }
}
