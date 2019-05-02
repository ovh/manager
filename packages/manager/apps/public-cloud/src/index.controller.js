import angular from 'angular';

import feedback from './feedback-icon.svg';
import { BREAKPOINT, KEY } from './components/walkMe/walkme.constants';

import options from './navbar.config';

export default class PublicCloudController {
  /* @ngInject */
  constructor($scope, $timeout, $window, ovhUserPref, WalkMe) {
    this.$scope = $scope;
    this.feedbackUrl = __FEEDBACK_URL__;
    this.feedback = feedback;
    this.ovhUserPref = ovhUserPref;
    this.WalkMe = WalkMe;

    this.navbarOptions = options;

    $scope.$on('navbar.loaded', () => $timeout(() => {
      this.shouldShowWalkMe = (localStorage.getItem(KEY) || true) && $window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches;
      if (this.shouldShowWalkMe) {
        this.tour = this.WalkMe.start();
        angular.element('oui-navbar').on('click', () => this.endWalkMe());
      }
    }));

    // this.ovhUserPref.getValue(KEY)
    //   .then(({ value }) => {
    //     this.shouldShowWalkMe = value;
    //   })
    //   .catch(({ status }) => {
    //     if (status === 404) {
    //       this.shouldShowWalkMe = true;
    //     }
    //   })
    //   .finally(() => {
    //     // TODO : Remove matchMedia for mobile version
    //     if (this.shouldShowWalkMe
    //  && $window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches) {
    //       this.tour = this.WalkMe.start();
    //       angular.element('oui-navbar').on('click', () => this.endWalkMe());
    //     }
    //   }));
  }

  endWalkMe() {
    this.tour.end();
    this.WalkMe.end();
    this.shouldShowWalkMe = false;
  }
}
