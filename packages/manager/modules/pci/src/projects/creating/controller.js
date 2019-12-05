import find from 'lodash/find';
import get from 'lodash/get';
import some from 'lodash/some';

import {
  ORDER_FOLLOW_UP_POLLING_INTERVAL,
  ORDER_FOLLOW_UP_STATUS_ENUM,
  ORDER_FOLLOW_UP_STEP_ENUM,
  SLIDE_ANIMATION_INTERVAL,
  SLIDE_IMAGES,
} from './constants';

export default class PciProjectCreatingCtrl {
  /* @ngInject */
  constructor($q, $timeout, pciProjectCreating) {
    // dependencies injections
    this.$q = $q;
    this.$timeout = $timeout;
    this.pciProjectCreating = pciProjectCreating;

    // other attributes
    this.pollingNamespace = 'pci.projects.order';
    this.orderFollowUpPolling = null;

    this.imageSlider = {
      currentIndex: 0,
      list: SLIDE_IMAGES,
    };
  }

  getDeliveredProjectId() {
    return this.pciProjectCreating
      .getOrderDetails(this.orderId)
      .then((details) => get(details, '[0].domain'));
  }

  /* ==============================
  =            Polling            =
  =============================== */

  startOrderFollowUpPolling(interval = ORDER_FOLLOW_UP_POLLING_INTERVAL) {
    this.orderFollowUpPolling = this.$timeout(() => {
      this.pciProjectCreating
        .getOrderFollowUp(this.orderId)
        .then((followUp) => {
          const { status } = find(followUp, {
            step: ORDER_FOLLOW_UP_STEP_ENUM.DELIVERING,
          });

          if (status === ORDER_FOLLOW_UP_STATUS_ENUM.DONE) {
            return this.getDeliveredProjectId().then((projectId) =>
              this.onProjectDelivered(projectId),
            );
          }

          const hasStepInError = some(followUp, {
            status: ORDER_FOLLOW_UP_STATUS_ENUM.ERROR,
          });

          if (hasStepInError) {
            this.onProjectDeliveryFail();
          }

          return followUp;
        })
        .finally(() => {
          if (this.orderFollowUpPolling) {
            this.startOrderFollowUpPolling();
          }
        });
    }, interval);

    return this.orderFollowUpPolling;
  }

  stopOrderFollowUpPolling() {
    if (this.orderFollowUpPolling) {
      this.$timeout.cancel(this.orderFollowUpPolling);
      this.orderFollowUpPolling = null;
    }
  }

  /* -----  End of Polling  ------ */

  /* ===================================
  =            Image slider            =
  ==================================== */

  slideImages() {
    return this.$timeout(() => {
      if (this.imageSlider.currentIndex >= this.imageSlider.list.length - 1) {
        this.imageSlider.currentIndex = 0;
      } else {
        this.imageSlider.currentIndex += 1;
      }
      return this.slideImages();
    }, SLIDE_ANIMATION_INTERVAL);
  }

  /* -----  End of Image slider  ------ */

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    this.slideImages();
    this.startOrderFollowUpPolling(0);
  }

  $onDestroy() {
    this.stopOrderFollowUpPolling();
  }

  /* -----  End of Hooks  ------ */
}
