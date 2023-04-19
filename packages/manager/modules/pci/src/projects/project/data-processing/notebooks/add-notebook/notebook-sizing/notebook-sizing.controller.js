import { convertToGio } from '../../../data-processing.utils';

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
      },
    ];

    this.selectedNotebookTemplate = this.availableNotebookTemplate[0].name;
    this.selectedClusterTemplate = this.availableClusterTemplate[0].name;

    this.availableNotebookTemplate = this.availableNotebookTemplate.map(
      (template) => {
        return {
          ...template,
          price: this.prices.notebook[template.name]
            ? this.prices.notebook[template.name].priceInUcents
            : 0,
          tax: this.prices.notebook[template.name]
            ? this.prices.notebook[template.name].tax
            : 0,
        };
      },
    );

    this.availableClusterTemplate = this.availableClusterTemplate.map(
      (template) => {
        return {
          ...template,
          price: this.prices.notebook[template.name]
            ? this.prices.notebook[template.name].priceInUcents
            : 0,
          tax: this.prices.notebook[template.name]
            ? this.prices.notebook[template.name].tax
            : 0,
        };
      },
    );

    this.onChangeSelectedTemplate();

    this.convertToGio = convertToGio;
  }

  onChangeSelectedTemplate() {
    this.onChangeHandler({
      notebook: this.selectedNotebookTemplate,
      cluster: this.selectedClusterTemplate,
    });
  }
}
