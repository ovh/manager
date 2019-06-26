export default class {
  /* @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  dismissModal() {
    this.goBack();
  }

  closeModal() {
    this.$state.go('pci.projects.project.quota', { projectId: this.projectId });
  }
}
