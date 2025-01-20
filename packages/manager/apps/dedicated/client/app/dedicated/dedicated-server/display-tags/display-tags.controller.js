export default class {
  /* @ngInject */
  constructor($uibModalInstance, serverName, serverTags) {
    this.$uibModalInstance = $uibModalInstance;
    this.serverName = serverName;
    this.serverTags = serverTags;
  }

  $onInit() {
    this.serverTagList = this.serverTags;
  }

  onEditTags() {
    this.$uibModalInstance.close();
    this.$state.go('app.dedicated-server.server.tags');
  }

  onSearchServerTags(value) {
    this.serverTagList = this.serverTags.filter((tag) =>
      tag.toLowerCase().includes(value.toLowerCase()),
    );
  }

  onSearchReset() {
    this.serverTagList = [...this.serverTags];
  }

  back() {
    this.$uibModalInstance.dismiss();
  }
}
