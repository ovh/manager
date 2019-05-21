import feedback from './feedback-icon.svg';
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
    publicCloud,
    SessionService,
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
    this.publicCloud = publicCloud;
    this.sessionService = SessionService;
    this.navbarOptions = options;

    $scope.$on('oui-step-form.submit', (event, { form }) => {
      this.atInternet.trackClick({
        name: form.$name,
        type: 'action',
      });
    });
  }

  $onInit() {
    this.$translate.refresh()
      .then(() => {
        this.sidebarLinks = this.CloudSidebar.getSidebarLinks(this.$stateParams);
        this.sessionService.getUser()
          .then((user) => {
            this.user = user;
          });
      });
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
              // Go to error page
              return this.$state.go('pci.error');
            });
        }
        return this.$state.go('pci.projects.onboarding');
      }));
  }
}
