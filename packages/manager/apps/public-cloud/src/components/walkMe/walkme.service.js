import angular from 'angular';

import popoverTemplate from './templates/popover.html';

import WalkMeTemplate from './template.class';

import {
  DESKTOP_STEPS, KEY,
} from './walkme.constants';

export default class WalkMe {
  /* @ngInject */
  constructor($translate, $window, ovhUserPref) {
    this.$translate = $translate;
    this.$window = $window;

    this.ovhUserPref = ovhUserPref;

    this.initSteps();
  }

  initSteps() {
    this.STEPS = DESKTOP_STEPS;
    // this.$window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches
    //   ? DESKTOP_STEPS : MOBILE_STEPS;
  }

  getTour() {
    return new Tour({
      name: 'public-cloud-walkme',
      steps: this.getSteps(),
      debug: true,
      // AngularJS will not be interpreted within the popover
      template: index => popoverTemplate.replace('{{ navigation }}', WalkMeTemplate.getNavigation(index, this.STEPS)),
      storage: false,
      onEnd: () => {
        angular.element('.tour-backdrop').remove();
        this.end();
      },
    });
  }

  getSteps() {
    return this.STEPS.map(step => ({
      element: step.element,
      content: this.$translate.instant(step.content),
      placement: 'bottom',
      title: this.$translate.instant('walkme_title'),
      onShown: (tour) => {
        const index = tour.getCurrentStep();
        angular.element(`#indicator-${index}`).addClass('walkme-indicator_active');
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

  // eslint-disable-next-line class-methods-use-this
  end() {
    return localStorage.setItem(KEY, true);
    // return this.ovhUserPref.assign(KEY, true);
  }
}
