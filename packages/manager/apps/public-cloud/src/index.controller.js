import angular from 'angular';

import feedback from './feedback-icon.svg';
import { KEY } from './components/walkMe/walkme.constants';
import { DEFAULT_PROJECT_KEY } from './index.constants';

import options from './navbar.config';

export default class PublicCloudController {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $stateParams,
    $timeout,
    $translate,
    $window,
    atInternet,
    CloudSidebar,
    ovhUserPref,
    WalkMe,
    publicCloud,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$window = $window;
    this.atInternet = atInternet;
    this.CloudSidebar = CloudSidebar;
    this.feedbackUrl = __FEEDBACK_URL__;
    this.feedback = feedback;
    this.ovhUserPref = ovhUserPref;
    this.WalkMe = WalkMe;
    this.publicCloud = publicCloud;

    this.navbarOptions = options;

    $scope.$on('navbar.loaded', () => $timeout(() => {
      this.startWalkMe();
    }));

    $scope.$on('oui-step-form.submit', (event, { form }) => {
      this.atInternet.trackClick({
        name: form.$name,
        type: 'action',
      });
    });

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

  initRedirect() {
    return this.publicCloud
      .getProjects([{
        field: 'status',
        comparator: 'in',
        reference: ['creating', 'ok'],
      }])
      .then(((projects) => {
        if (projects.length > 0) {
          return this.ovhUserPref
            .getValue(DEFAULT_PROJECT_KEY)
            .then(({ projectId }) => this.$state.go('pci.projects.project', {
              projectId,
            }))
            .catch((err) => {
              if (err.status === 404) {
                // No project is defined as favorite
                // Go on the first one :)
                return this.$state.go('pci.projects.project', {
                  projectId: projects[0].project_id,
                });
              }
              // [TODO] Go to error page
              return null;
            });
        }
        return this.$state.go('pci.projects.onboarding');
      }));
  }
}
