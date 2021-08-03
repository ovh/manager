import { getDataProcessingUiUrl } from '../data-processing.utils';
import {
  DATA_PROCESSING_STATUS_TO_CLASS,
  DATA_PROCESSING_GUIDE_URL,
} from '../data-processing.constants';

export default class {
  /* @ngInject */
  constructor(
    $state,
    $uibModal,
    CucCloudMessage,
    dataProcessingService,
    ovhManagerRegionService,
  ) {
    this.$state = $state; // router state
    this.cucCloudMessage = CucCloudMessage;
    this.dataProcessingService = dataProcessingService;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.DATA_PROCESSING_STATUS_TO_CLASS = DATA_PROCESSING_STATUS_TO_CLASS;
    this.getDataProcessingUiUrl = getDataProcessingUiUrl;
    this.guideUrl = DATA_PROCESSING_GUIDE_URL;
  }
}
