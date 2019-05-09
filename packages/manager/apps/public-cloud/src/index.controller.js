import angular from 'angular';

import feedback from './feedback-icon.svg';
import { KEY } from './components/walkMe/walkme.constants';

import options from './navbar.config';

export default class PublicCloudController {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $timeout,
    $translate,
    $window,
    CloudSidebar,
    ovhUserPref,
    WalkMe,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.CloudSidebar = CloudSidebar;
    this.feedbackUrl = __FEEDBACK_URL__;
    this.feedback = feedback;
    this.ovhUserPref = ovhUserPref;
    this.WalkMe = WalkMe;

    this.navbarOptions = options;

    $scope.$on('navbar.loaded', () => $timeout(() => {
      this.startWalkMe();
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

  $onInit() {
    this.$translate.refresh()
      .then(() => {
        this.sidebarLinks = this.CloudSidebar.getSidebarLinks(this.$stateParams);
      });
  }

  startWalkMe() {
    this.shouldShowWalkMe = !localStorage.getItem(KEY);
    if (this.shouldShowWalkMe) {
      this.tour = this.WalkMe.start();
      angular.element('oui-navbar').on('click', () => this.endWalkMe());
    }
  }

  endWalkMe() {
    this.tour.end();
    this.WalkMe.end();
    this.shouldShowWalkMe = false;
  }
}
