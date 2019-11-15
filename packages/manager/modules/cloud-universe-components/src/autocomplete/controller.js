import findIndex from 'lodash/findIndex';
import groupBy from 'lodash/groupBy';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';

export default class CucAutoCompleteController {
  /* @ngInject */
  constructor($timeout, $filter, $element) {
    this.defaultItemsNumber = 6;
    this.keys = {
      arrowUp: 38,
      arrowDown: 40,
      escape: 27,
      enter: 13,
      tab: 9,
    };

    this.currentSelection = '';

    this.$timeout = $timeout;
    this.$filter = $filter;
    this.$element = $element;
  }

  openList() {
    this.currentSelection = null;
    this.arrangeOptions();
    this.showList = true;

    this.resetHighlight();
  }

  closeList() {
    // If the user reopened the dropdown after selecting a value and left without selecting one
    // he didn't change his selection.
    if (this.ngModel && !this.currentSelection) {
      this.updateModel(this.ngModel);
    }

    this.showList = false;
  }

  beginEdit() {
    this.editing = true;
    this.forceOpen = true;
    this.openList();
    this.placeHighlightOnModel();
  }

  endEdit() {
    this.editing = false;

    // if the user was typing something
    // that is not in the list we need to make sure model is updated.
    if (!this.filteredOptions.length) {
      this.chooseItem();
    }
    this.closeList();
  }

  toggleEdit() {
    if (this.editing && !this.forceOpen) {
      this.endEdit();
    } else if (!this.editing) {
      this.beginEdit();
    } else if (this.forceOpen) {
      this.forceOpen = false;
    }
  }

  filterChange() {
    if (this.editing) {
      this.chooseItem();

      const selected = this.currentSelection;
      this.arrangeOptions();

      if (this.filteredOptions.length) {
        // If the list what closed by a previous filter, we reopen it and apply the user input.
        if (!this.showList) {
          this.openList();
          this.updateSelected(selected);
          this.filterChange();
        } else { // else we scroll to the top of the list.
          this.resetHighlight();
        }
      } else {
        // If the user enter something that is not in the list, we need to update the model object.
        this.closeList();
      }

      const list = this.getDomList();
      if (list) {
        list.scrollTop = 0;
      }
    }
  }

  arrangeOptions() {
    this.orderOptions();
    this.filterOptions(this.currentSelection);
    this.groupOptions();
  }

  orderOptions() {
    this.options = this.$filter('orderBy')(this.options, this.orderBy);
  }

  filterOptions(filter) {
    if (filter) {
      const displayProperty = this.displayProperty; // eslint-disable-line
      const filtered = [];
      const regExp = new RegExp(filter, 'g');
      angular.forEach(this.options, (item) => {
        if (item[displayProperty].indexOf(filter) !== -1) {
          set(item, 'filteredProperty', item[displayProperty].replace(regExp, `<strong>${filter}</strong>`));
          filtered.push(item);
        }
      });

      this.filteredOptions = filtered;
    } else {
      angular.forEach(this.options, (item) => {
        set(item, ' ', undefined);
      });
      this.filteredOptions = this.options;
    }
  }

  groupOptions() {
    if (this.groupBy) {
      this.groupedOptions = groupBy(this.filteredOptions, this.groupBy);
    }
  }

  changeHighlight(event) {
    const keyCode = event.which || event.keyCode;
    switch (keyCode) {
      case this.keys.arrowUp:
        if (this.editing) {
          this.moveHightlightUp();
          this.updateSelected(this.filteredOptions[this.highlightIndex][this.displayProperty]);
          event.preventDefault();
        }
        break;
      case this.keys.arrowDown:
        if (this.editing) {
          this.moveHightlightDown();
          this.updateSelected(this.filteredOptions[this.highlightIndex][this.displayProperty]);
          event.preventDefault();
        }
        break;
      case this.keys.enter:
        if (this.editing) {
          this.confirmChooseItem(this.filteredOptions[this.highlightIndex]);
          event.preventDefault();
        } else {
          this.beginEdit();
          event.preventDefault();
        }
        break;
      case this.keys.tab:
      case this.keys.escape:
        if (this.editing) {
          this.confirmChooseItem(this.filteredOptions[this.highlightIndex]);
          event.preventDefault();
        }
        break;
      default:
        break;
    }
  }

  confirmChooseItem(item, event) {
    this.chooseItem(item);
    this.endEdit();

    // If an event is present it means that the function was called by the onclick of an element
    // in which case we don't want it to unfocus the textbox.
    if (event) {
      event.preventDefault();
    }
  }

  chooseItem(itemParam) {
    let item = itemParam;
    // It means that the user decided not to choose something from the list.
    if (!item) {
      if (this.currentSelection) {
        item = {};
        item[this.displayProperty] = this.currentSelection;
        item.isNew = true;
      } else {
        item = null;
      }
    }

    this.updateModel(item);
  }

  updateModel(newModel) {
    this.ngModel = newModel;

    if (newModel) {
      this.updateSelected(newModel[this.displayProperty]);
    } else {
      this.updateSelected(null);
    }
  }

  updateSelected(newSelected) {
    this.currentSelection = newSelected;
  }

  moveHightlightUp() {
    // We check if the user it still editing to avoid DOM errors.
    if (this.editing) {
      const list = this.getDomList();

      if (this.highlightIndex !== 0) {
        this.decrementHighlightIndexes();

        const elem = this.getDomListItems()[this.highlightIndex];
        if (list.scrollTop > elem.offsetTop) {
          list.scrollTop = elem.offsetTop;
        }
      }
    }
  }

  moveHightlightDown() {
    // We check if the user it still editing to avoid DOM errors.
    if (this.editing) {
      if (this.highlightIndex !== this.filteredOptions.length - 1) {
        this.incrementHighlightIndexes();
        this.scrollDownToHighlightedIndex();
      }
    }
  }

  scrollDownToHighlightedIndex() {
    const list = this.getDomList();
    const elem = this.getDomListItems()[this.highlightIndex];
    const listOffsetBottom = list.clientHeight + list.scrollTop - elem.offsetHeight;
    if (listOffsetBottom < elem.offsetTop) {
      const scrollPosition = elem.offsetTop + elem.offsetHeight - list.clientHeight;
      list.scrollTop = scrollPosition;
    }
  }

  /* eslint-disable class-methods-use-this */
  getDomList() {
    return document.querySelector('.cloud-autocomplete__list');
  }

  /* eslint-disable class-methods-use-this */
  getDomListItems() {
    return document.querySelectorAll('.cloud-autocomplete__list__item');
  }

  /* eslint-disable class-methods-use-this */
  preventEvent(event) {
    event.preventDefault();
  }

  incrementHighlightIndexes() {
    this.highlightIndex += 1;
    this.highlightedGroupIndex += 1;
    this.adjustHighlightGroupIndexes('down');
  }

  decrementHighlightIndexes() {
    this.highlightIndex -= 1;
    this.highlightedGroupIndex -= 1;
    this.adjustHighlightGroupIndexes('up');
  }

  adjustHighlightGroupIndexes(direction) {
    if (this.groupBy) {
      const currItem = this.filteredOptions[this.highlightIndex];
      this.highlightedGroupKey = this.getArrangedGroupName(currItem[this.groupBy]);
      let precItem = null;
      switch (direction) {
        case 'up':
          // If we changed group and we are going up, we are on the last element
          // of the previous group.
          precItem = this.filteredOptions[this.highlightIndex + 1];
          if (!precItem || precItem[this.groupBy] !== currItem[this.groupBy]) {
            this.highlightedGroupIndex = this.groupedOptions[currItem[this.groupBy]].length - 1;
          }
          break;
        default:
          // If we changed group and we are going down,
          // we are on the first element of the next group.
          precItem = this.filteredOptions[this.highlightIndex - 1];
          if (!precItem || precItem[this.groupBy] !== currItem[this.groupBy]) {
            this.highlightedGroupIndex = 0;
          }
          break;
      }
    }
  }

  placeHighlightOnModel() {
    // When we open the dropdown and a selection was made beforehand
    // we have to scroll and highlight the selected item.
    if (this.ngModel && !this.ngModel.isNew) {
      const selectedModel = this.ngModel;
      this.highlightIndex = findIndex(this.options, item => item === selectedModel);

      if (this.groupBy) {
        this.highlightedGroupKey = this.getArrangedGroupName(
          this.options[this.highlightIndex][this.groupBy],
        );

        const optionToFind = this.options[this.highlightIndex];
        this.highlightedGroupIndex = findIndex(
          this.groupedOptions[this.highlightedGroupKey],
          item => item === optionToFind,
        );
      }
      this.$timeout(this.scrollDownToHighlightedIndex.bind(this));
    }
  }

  resetHighlight() {
    this.highlightIndex = 0;

    if (this.groupBy) {
      this.highlightedGroupKey = this.getArrangedGroupName(this.filteredOptions[0][this.groupBy]);
      this.highlightedGroupIndex = 0;
    }
  }

  /* eslint-disable class-methods-use-this */
  getArrangedGroupName(groupName) {
    return isUndefined(groupName) ? 'undefined' : groupName;
  }
}
