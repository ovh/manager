import find from 'lodash/find';
import some from 'lodash/some';

import { SLIDE_ANIMATION_INTERVAL, SLIDE_IMAGES } from './constants';
import {
  ORDER_FOLLOW_UP_POLLING_INTERVAL,
  ORDER_FOLLOW_UP_STATUS_ENUM,
  ORDER_FOLLOW_UP_STEP_ENUM,
} from '../projects.constant';
import { PCI_HDS_ADDON } from '../project/project.constants';

export default class PciProjectCreatingCtrl {
  /* @ngInject */
  constructor($q, $timeout, pciProjectCreating, PciProjectsService) {
    // dependencies injections
    this.$q = $q;
    this.$timeout = $timeout;
    this.pciProjectCreating = pciProjectCreating;
    this.PciProjectsService = PciProjectsService;

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
      .then((details) => {
        const orderItemsDetailPromises = details.map(({ orderDetailId }) =>
          this.pciProjectCreating
            .getOrderItemDetails(this.orderId, orderDetailId)
            .then((data) => {
              return { orderDetailId, item: data };
            }),
        );

        return this.$q
          .all(orderItemsDetailPromises)
          .then((orderItemsDetails) => {
            return { details, orderItemsDetails };
          });
      })
      .then(({ details, orderItemsDetails }) => {
        const itemDetails = orderItemsDetails.find(
          ({ item }) => item.order.plan.code === PCI_HDS_ADDON.parentPlanCode,
        );
        const detail = details.find(
          ({ orderDetailId }) => itemDetails.orderDetailId === orderDetailId,
        );

        return detail.domain;
      });
  }

  /* ==============================
  =            Polling            =
  =============================== */

  startOrderFollowUpPolling(interval = ORDER_FOLLOW_UP_POLLING_INTERVAL) {
    this.orderFollowUpPolling = this.$timeout(() => {
      this.PciProjectsService.getOrderFollowUp(this.orderId)
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
