import angular from 'angular';

import feedback from './feedback-icon.svg';
import { BREAKPOINT, KEY } from './components/walkMe/walkme.constants';

export default class PublicCloudController {
  /* @ngInject */
  constructor($scope, $state, $transitions, $window, ovhUserPref, WalkMe) {
    this.$state = $state;
    this.feedbackUrl = __FEEDBACK_URL__;
    this.feedback = feedback;
    this.$transitions = $transitions;
    this.ovhUserPref = ovhUserPref;
    this.WalkMe = WalkMe;

    this.$transitions.onSuccess({}, () => {
      this.shouldDisplaySidebar = $state.includes('pci.projects.project')
        && !$state.is('pci.projects.project.creating');
    });

    $scope.$on('navbar.loaded', () => this.ovhUserPref.getValue(KEY)
      .then(({ value }) => {
        this.shouldShowWalkMe = value;
      })
      .catch(({ status }) => {
        if (status === 404) {
          this.shouldShowWalkMe = true;
        }
      })
      .finally(() => {
        // TODO : Remove matchMedia for mobile version
        if (this.shouldShowWalkMe && $window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches) {
          this.tour = this.WalkMe.start();
          angular.element('oui-navbar').on('click', () => this.endWalkMe());
        }
      }));
  }

  endWalkMe() {
    this.tour.end();
    this.WalkMe.end();
    this.shouldShowWalkMe = false;
  }
}
