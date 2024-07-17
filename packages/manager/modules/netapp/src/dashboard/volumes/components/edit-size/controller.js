import { MIN_SIZE } from './constant';

export default class VolumeCreateCtrl {
  $onInit() {
    this.model = {
      size: this.volume.size,
    };

    this.boundaries = {
      max: this.volume.size + this.remainingQuota,
      min: MIN_SIZE,
    };
  }

  /* TODO: IMPLEMENT modify size method */
}
