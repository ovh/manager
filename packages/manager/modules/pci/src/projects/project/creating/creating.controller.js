import EnvironmentService from '@ovh-ux/manager-config';
import get from 'lodash/get';

import { PCI_REDIRECT_URLS } from '../../../constants';

import {
  SLIDE_ANIMATION_INTERVAL,
  SLIDE_IMAGES,
} from './creating.constants';

export default class ProjectCreatingCtrl {
  /* @ngInject */
  constructor($q, $timeout, Poller) {
    // dependencies injections
    this.$q = $q;
    this.$timeout = $timeout;
    this.Poller = Poller;

    // other attributes
    this.pollingNamespace = 'pci.projects.creating';

    this.imageSlider = {
      currentIndex: 0,
      list: SLIDE_IMAGES,
    };

    this.supportUrl = get(
      PCI_REDIRECT_URLS,
      `${EnvironmentService.Environment.region}.support`,
    );
  }

  startCreationPolling() {
    return this.Poller.poll(`/cloud/project/${this.projectId}`, null, {
      namespace: this.pollingNamespace,
      successRule(details) {
        return details.status === 'ok';
      },
    })
      .then(() => this.onProjectCreated());
  }

  stopCreationPolling() {
    return this.Poller.kill({
      namespace: this.pollingNamespace,
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
    this.stopCreationPolling();
    return this.startCreationPolling();
  }

  $onDestroy() {
    return this.stopCreationPolling();
  }

  /* -----  End of Hooks  ------ */
}
