import { countAiItems } from '../../ai-dashboard.constants';
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
    this.hasData = this.aiItems && countAiItems(this.aiItems) > 0;
    // bind images for pipeline
    this.images = {
      explore: exploreImage,
      serve: serveImage,
      stock: stockImage,
      train: trainImage,
    };
  }

  updateStatus() {
    this.hasData = this.aiItems && countAiItems(this.aiItems) > 0;
    if (this.hasData) {
      this.itemsByStatus = {
        notebooks: {
          running: 0,
          stopped: 0,
        },
        trainings: {
          running: 0,
          stopped: 0,
        },
        apps: {
          running: 0,
          stopped: 0,
        },
      };

      Object.keys(this.aiItems).forEach((itemKey) => {
        this.aiItems[itemKey].forEach((aiItem) => {
          const statuses = TOOLS_STATUSES[itemKey.toUpperCase()];
          if (statuses) {
            this.itemsByStatus[itemKey].running += statuses.RUNNING.includes(
              aiItem.status.state,
            );
            this.itemsByStatus[itemKey].stopped += statuses.STOPPED.includes(
              aiItem.status.state,
            );
          }
        });
      });
    }
  }
}
