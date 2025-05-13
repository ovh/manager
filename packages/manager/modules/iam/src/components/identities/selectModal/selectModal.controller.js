export default class selectModalController {
  /* @ngInject */
  constructor($q) {
    this.$q = $q;

    this.data = [];
    this.options = [];
    this.query = [];
    this.error = '';

    this.filterFn = this.filter.bind(this);
  }

  $onInit() {
    this.isLoading = true;

    this.$q
      .when(this.getOptions())
      .then(({ data, errorMessage }) => {
        this.error = errorMessage;
        this.options = data && this.generateOptions(data);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  generateOptions(data) {
    return data
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

    this.onAddOptions({ selectedOptions });
  }

  filter(option) {
    return this.searchFilter(option, this.query);
  }

  onChangeSearch(searchValue) {
    this.query = searchValue;
  }

  onReset() {
    this.query = '';
  }
}
