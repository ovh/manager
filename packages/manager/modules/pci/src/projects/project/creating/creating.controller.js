import { SLIDE_ANIMATION_INTERVAL, SLIDE_IMAGES } from './creating.constants';

export default class ProjectCreatingCtrl {
  /* @ngInject */
  constructor($q, $timeout, Poller) {
    // dependencies injections
    this.$q = $q;
    this.$timeout = $timeout;
    this.Poller = Poller;

    // other attributes
    this.pollingNamespace = {
      order: 'pci.projects.order',
      project: 'pci.projects.creating',
    };

    this.imageSlider = {
      currentIndex: 0,
      list: SLIDE_IMAGES,
    };
  }

  startOrderPolling() {
    return this.Poller.poll(`/me/order/${this.project.orderId}/status`, null, {
      namespace: this.pollingNamespace.order,
      successRule(status) {
        return status !== 'checking';
      },
    }).then((status) => {
      if (status === 'notPaid') {
        return this.onProjectCreated(); // it has to redirect to same page
      }

      return this.startCreationPolling();
    });
  }

  startCreationPolling() {
    return this.Poller.poll(`/cloud/project/${this.projectId}`, null, {
      namespace: this.pollingNamespace.project,
      successRule(details) {
        return details.status === 'ok';
      },
    }).then(() => this.onProjectCreated());
  }

  stopPollings() {
    this.stopOrderPolling();
    this.stopCreationPolling();
  }

  stopOrderPolling() {
    return this.Poller.kill({
      namespace: this.pollingNamespace.order,
    });
  }

  stopCreationPolling() {
    return this.Poller.kill({
      namespace: this.pollingNamespace.project,
    });
  }

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

  /* ============================
  =            Hooks            =
  ============================= */

  $onInit() {
    this.slideImages();
    this.stopPollings();
    if (this.projectOrderStatus === 'checking') {
      return this.startOrderPolling();
    }
    return this.startCreationPolling();
  }

  $onDestroy() {
    return this.stopPollings();
  }

  /* -----  End of Hooks  ------ */
}
