import { VISUALIZER_IMG_SRC } from './website-coach.constant';

export default class {
  constructor() {
    this.VISUALIZER_IMG_SRC = VISUALIZER_IMG_SRC;
  }

  $onInit() {
    [this.attachedDomain] = this.attachedDomains;
    this.hasMultipleAttachedDomain = this.attachedDomains.length > 1;
  }
}
