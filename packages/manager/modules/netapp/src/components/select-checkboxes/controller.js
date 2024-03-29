import { isEqual } from 'lodash-es';

export default class SelectCheckboxesCtrl {
  /* @ngInject */
  constructor($compile, $element, $scope, $timeout, $translate) {
    this.$compile = $compile;
    this.$element = $element;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$translate = $translate;
  }

  $onInit() {
    this.showList = false;
    this.totalItems = this.items.filter(({ checked }) => checked);
    this.selectAll = this.items.reduce(
      (all, item) => all && item.checked,
      true,
    );
  }

  focusOnItems(event) {
    event.stopPropagation();
    event.preventDefault();

    switch (event.keyCode) {
      case 13:
      case 32:
        this.toggleList();
        break;
      default:
        break;
    }
  }

  getCountLabel() {
    switch (this.totalItems.length) {
      case 0:
        return (
          this.placeholder ||
          this.$translate.instant('select_checkboxes_placeholder_default')
        );
      case 1:
        return (
          this.placeholder ||
          this.$translate.instant('select_checkboxes_one_item')
        );
      default:
        return (
          this.placeholder ||
          this.$translate.instant('select_checkboxes_many_items', {
            count: this.totalItems.length,
          })
        );
    }
  }

  toggleList() {
    this.showList = !this.showList;

    if (this.showList) {
      this.$timeout(() => {
        this.resizeDropdown();
      });
    }
  }

  resizeDropdown() {
    const [selectCheckbox] = this.$element.find('label.oui-select');
    const [checkboxList] = this.$element.find('div.checkbox_list');
    checkboxList.style.width = `${selectCheckbox.offsetWidth}px`;
  }

  onSelectAll(checked) {
    this.items.forEach((item) => {
      this.onItemSelect(item, checked);
      Object.assign(item, { checked });
    });
  }

  onItemSelect(item, checked) {
    this.totalItems = checked
      ? [...this.totalItems, item]
      : [...this.totalItems.filter((element) => !isEqual(element, item))];

    if (this.onSelect instanceof Function) {
      this.onSelect({ items: this.totalItems });
    }
  }

  $postLink() {
    const $htmlContent = angular.element(this.htmlContent);

    this.$compile($htmlContent)(this.$scope, (clone) => {
      this.$element.append(clone);
    });

    document.addEventListener('click', (event) => {
      return (() => {
        if (!event.target.closest('.select-checkboxes')) {
          this.$timeout(() => {
            this.showList = false;
          });
        }
      })();
    });
  }
}
