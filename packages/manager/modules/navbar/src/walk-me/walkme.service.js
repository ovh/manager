import angular from 'angular';

import popoverTemplate from './templates/popover.html';

import WalkMeTemplate from './template.class';

import {
  BREAKPOINT,
  DESKTOP_STEPS,
  KEY,
  MOBILE_STEPS,
} from './walkme.constants';

export default class WalkMe {
  /* @ngInject */
  constructor($translate, $window, coreConfig, ovhUserPref) {
    this.$translate = $translate;
    this.$window = $window;

    this.coreConfig = coreConfig;
    this.ovhUserPref = ovhUserPref;

    this.initSteps();
  }

  isOnSmallScreen() {
    return this.$window.matchMedia(`(max-width: ${BREAKPOINT}px)`).matches;
  }

  initSteps() {
    this.STEPS = this.isOnSmallScreen() ? MOBILE_STEPS : DESKTOP_STEPS;
  }

  getTour() {
    return new Tour({
      name: 'public-cloud-walkme',
      steps: this.getSteps(),
      // AngularJS will not be interpreted within the popover
      template: (index) =>
        popoverTemplate.replace(
          '{{ navigation }}',
          WalkMeTemplate.getNavigation(index, this.STEPS),
        ),
      storage: false,
      onEnd: () => {
        angular.element('.tour-backdrop').remove();
        this.end();
      },
    });
  }

  getStepContent(step) {
    const key =
      this.isOnSmallScreen() || !this.coreConfig.isRegion('US')
        ? step.content
        : `${step.content}_${this.coreConfig.getRegion()}`;
    return this.$translate.instant(key);
  }

  getSteps() {
    return this.STEPS.map((step) => ({
      element: step.element,
      content: this.getStepContent(step),
      placement: 'bottom',
      title: this.$translate.instant('walkme_title'),
      onShown: (tour) => {
        const index = tour.getCurrentStep();
        angular
          .element(`#indicator-${index}`)
          .addClass('walkme-indicator_active');
        angular.element(step.element).addClass('walkme-highlighted');
      },
      onHide: () => {
        angular.element(step.element).removeClass('walkme-highlighted');
      },
    }));
  }

  start() {
    const tour = this.getTour();
    tour.init();
    tour.start();
    return tour;
  }

  end() {
    return this.ovhUserPref.assign(KEY, true);
  }
}
