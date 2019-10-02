import { USER_INFOS_URL, VISUALIZER_IMG_SRC } from './website-coach.constant';

export default class {
  constructor() {
    this.USER_INFOS_URL = USER_INFOS_URL;
    this.VISUALIZER_IMG_SRC = VISUALIZER_IMG_SRC;
  }

  $onInit() {
    [this.attachedDomain] = this.attachedDomains;
    this.hasMultipleAttachedDomain = this.attachedDomains.length > 1;
  }
}
