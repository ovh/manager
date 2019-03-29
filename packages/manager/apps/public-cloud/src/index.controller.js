export default class PublicCloudController {
  /* @ngInject */
  constructor($state, $transitions) {
    this.$state = $state;
    this.$transitions = $transitions;

    this.$transitions.onSuccess({}, () => {
      this.shouldDisplaySidebar = $state.includes('pci.projects.project');
    });
  }
}
