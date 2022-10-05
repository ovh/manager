import { TOOLS_STATUSES } from './ai-pipeline.constants';
import exploreImage from './assets/explore.png';
import serveImage from './assets/serve.png';
import stockImage from './assets/stock.png';
import trainImage from './assets/train.png';

export default class AIPipelineCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    // Compute statuses when items change
    this.$scope.$watch(
      '$ctrl.aiItems',
      () => {
        this.updateStatus();
      },
      true,
    );
    // check if user has already ordered ai product.
    // does not mean that there will be running or stopped status.
    this.hasData =
      this.aiItems &&
      Object.values(this.aiItems).reduce(
        (acc, itemArray) => acc + itemArray.length,
        0,
      ) > 0;
    // bind images for pipeline
    this.images = {
      explore: exploreImage,
      serve: serveImage,
      stock: stockImage,
      train: trainImage,
    };
  }

  updateStatus() {
    this.hasData =
      this.aiItems &&
      Object.values(this.aiItems).reduce(
        (acc, itemArray) => acc + itemArray.length,
        0,
      ) > 0;
    if (this.hasData) {
      this.runningNotebooks = AIPipelineCtrl.getItemsByStatusCount(
        this.aiItems.notebooks,
        TOOLS_STATUSES.NOTEBOOKS.RUNNING,
      );
      this.stoppedNotebooks = AIPipelineCtrl.getItemsByStatusCount(
        this.aiItems.notebooks,
        TOOLS_STATUSES.NOTEBOOKS.STOPPED,
      );
      this.runningTrainings = AIPipelineCtrl.getItemsByStatusCount(
        this.aiItems.trainings,
        TOOLS_STATUSES.TRAININGS.RUNNING,
      );
      this.stoppedTrainings = AIPipelineCtrl.getItemsByStatusCount(
        this.aiItems.trainings,
        TOOLS_STATUSES.TRAININGS.STOPPED,
      );
      this.runningApps = AIPipelineCtrl.getItemsByStatusCount(
        this.aiItems.apps,
        TOOLS_STATUSES.APPS.RUNNING,
      );
      this.stoppedApps = AIPipelineCtrl.getItemsByStatusCount(
        this.aiItems.apps,
        TOOLS_STATUSES.APPS.STOPPED,
      );
    }
  }

  static getItemsByStatusCount(items, statusList) {
    return items.filter((item) => statusList.includes(item.status.state))
      .length;
  }
}
