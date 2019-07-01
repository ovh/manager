import {
  ANALYTICS_DATA_PLATFORM_INPUT_NUMBER_PATTERN,
} from '../../analytics-data-platform.constants';

export default class {
  /* @ngInject */
  constructor() {
    this.INPUT_NUMBER_PATTERN = ANALYTICS_DATA_PLATFORM_INPUT_NUMBER_PATTERN;
    this.data = {
      hdfsEffectiveStorage: 0,
      edgeNodeStorage: 0,
    };
  }

  $onInit() {
    this.data.hdfsEffectiveStorage = this.storage.hdfsEffectiveStorage;
    this.data.edgeNodeStorage = this.edgeNodeStorage;
  }

  dataChange() {
    this.onDataChange({ data: this.data });
  }
}
