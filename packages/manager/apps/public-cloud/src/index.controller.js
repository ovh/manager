import feedback from './feedback-icon.svg';

export default class PublicCloudController {
  /* @ngInject */
  constructor($state, $transitions) {
    this.$state = $state;
    this.feedbackUrl = __FEEDBACK_URL__;
    this.feedback = feedback;
    this.$transitions = $transitions;

    this.$transitions.onSuccess({}, () => {
      this.shouldDisplaySidebar = $state.includes('pci.projects.project')
        && !$state.is('pci.projects.project.creating');
    });
  }
}
