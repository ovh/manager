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
    this.totalItems = [];
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
