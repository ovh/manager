export default class selectModalController {
  /* @ngInject */
  constructor($scope) {
    this.$scope = $scope;

    this.data = [];
    this.options = [];
    this.isLoading = false;
    this.query = [];
    this.error = '';
  }

  $onInit = async () => {
    await this.getData();
    this.generateOptions();

    this.$scope.$digest();
  };

  getData = async () => {
    this.isLoading = true;
    const { data, errorMessage } = await this.getOptions();

    this.data = data;
    this.error = errorMessage;
    this.isLoading = false;
  };

  generateOptions() {
    this.options = this.data
      .filter((option) => {
        return !this.currentIdentities.some(
          (identity) => identity.urn === option.urn,
        );
      })
      .map((option) => {
        return { ...option, selected: false };
      });
  }

  onAddSelectedOptions() {
    const selectedOptions = this.options.filter((option) => option.selected);

    this.onAddOptions(selectedOptions);
  }

  filter = (option) => {
    return this.searchFilter(option, this.query);
  };

  onChangeSearch(searchValue) {
    this.query = searchValue;
  }

  onReset() {
    this.query = '';
  }
}
