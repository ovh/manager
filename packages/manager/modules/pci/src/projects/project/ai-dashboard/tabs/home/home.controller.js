import { ITEMS_POLL_INTERVAL } from '../../ai-dashboard.constants';

export default class AIDashboardHomeCtrl {
  /* @ngInject */
  constructor(atInternet, $translate, AIDashboardService) {
    this.atInternet = atInternet;
    this.$translate = $translate;
    this.AIDashboardService = AIDashboardService;
  }

  $onInit() {
    // Poll data
    setInterval(() => this.getAIItems(), ITEMS_POLL_INTERVAL);
  }

  getAIItems() {
    this.AIDashboardService.getAIItems(this.projectId).then((data) => {
      this.aiItems = data;
    });
  }
}
