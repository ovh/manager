export default class NotebookSizingCtrl {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;
  }

  $onInit() {
    // create state
    this.availableNotebookTemplate = [
      {
        name: 'NB1-1',
        order: 0,
        CPU: 1,
        RAM: 4096,
        price: 0.03,
      },
    ];

    this.selectedNotebookTemplate = this.availableNotebookTemplate[0].name;
    this.selectedClusterTemplate = this.availableClusterTemplate[0].name;

    this.onChangeSelectedTemplate();
  }

  onChangeSelectedTemplate() {
    this.onChangeHandler({
      notebook: this.selectedNotebookTemplate,
      cluster: this.selectedClusterTemplate,
    });
  }
}
