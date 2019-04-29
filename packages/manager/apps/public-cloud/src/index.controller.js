import { KEY } from './components/walkMe/walkme.constants';

export default class PublicCloudController {
  /* @ngInject */
  constructor($scope, $state, $transitions, ovhUserPref, WalkMe) {
    this.$state = $state;
    this.$transitions = $transitions;
    this.ovhUserPref = ovhUserPref;
    this.WalkMe = WalkMe;

    this.$transitions.onSuccess({}, () => {
      this.shouldDisplaySidebar = $state.includes('pci.projects.project')
        && !$state.is('pci.projects.project.creating');
    });


    $scope.$on('navbar.loaded', () => {
      this.ovhUserPref.getValue(KEY)
        .then(({ value }) => {
          this.shouldShowWalkMe = value;
        })
        .catch(({ status }) => {
          if (status === 404) {
            this.shouldShowWalkMe = true;
          }
        })
        .finally(() => {
          if (this.shouldShowWalkMe) {
            this.tour = this.WalkMe.start();
          }
        });
    });
  }


  endWalkMe() {
    this.tour.end();
    this.WalkMe.end();
    this.shouldShowWalkMe = false;
  }
}
