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
        // if in project creation and redirected from hipay or paypal
        // we don't necessary have any project so do not redirect to onboarding state
        // $transition is not injected and stateParams not setted
        // so use hash and parse it to detect if hipay/paypal param is present
        const hashes = this.$window.location.hash.slice(
          this.$window.location.hash.indexOf('?') + 1,
        ).split('&');
        const params = {};
        hashes.map((hash) => {
          const [key, val] = hash.split('=');
          params[key] = decodeURIComponent(val);
          return true;
        });

        if (params.hiPayStatus || params.paypalAgreementStatus) {
          return true;
        }

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
