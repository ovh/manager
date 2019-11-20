export default class {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  dismissModal() {
    this.closeModal();
  }

  closeModal() {
    this.$state.go('pci.projects.project.data-processing.job-details.dashboard', { projectId: this.projectId });
  }
}
