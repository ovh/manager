import findIndex from 'lodash/findIndex';
import groupBy from 'lodash/groupBy';
import isUndefined from 'lodash/isUndefined';
import set from 'lodash/set';

function AutoCompleteController($timeout, $filter, $element) {
  const self = this;

  self.defaultItemsNumber = 6;
  self.keys = {
    arrowUp: 38,
    arrowDown: 40,
    escape: 27,
    enter: 13,
    tab: 9,
  };

  self.currentSelection = '';

  self.$timeout = $timeout;
  self.$filter = $filter;
  self.$element = $element;
}

AutoCompleteController.prototype.openList = function openList() {
  this.currentSelection = null;
  this.arrangeOptions();
  this.showList = true;

  this.resetHighlight();
};

AutoCompleteController.prototype.closeList = function closeList() {
  // If the user reopened the dropdown after selecting a value and left without selecting one
  // he didn't change his selection.
  if (this.ngModel && !this.currentSelection) {
    this.updateModel(this.ngModel);
  }

  this.showList = false;
};

AutoCompleteController.prototype.beginEdit = function beginEdit() {
  this.editing = true;
  this.forceOpen = true;
  this.openList();
  this.placeHighlightOnModel();
};

AutoCompleteController.prototype.endEdit = function endEdit() {
  this.editing = false;

  // if the user was typing something that is not in the list we need to make sure model is updated.
  if (!this.filteredOptions.length) {
    this.chooseItem();
  }
  this.closeList();
};

AutoCompleteController.prototype.toggleEdit = function toggleEdit() {
  if (this.editing && !this.forceOpen) {
    this.endEdit();
  } else if (!this.editing) {
    this.beginEdit();
  } else if (this.forceOpen) {
    this.forceOpen = false;
  }
};

AutoCompleteController.prototype.filterChange = function filterChange() {
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
      } else {
        // else we scroll to the top of the list.
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
};

AutoCompleteController.prototype.arrangeOptions = function arrangeOptions() {
  this.orderOptions();
  this.filterOptions(this.currentSelection);
  this.groupOptions();
};

AutoCompleteController.prototype.orderOptions = function orderOptions() {
  this.options = this.$filter('orderBy')(this.options, this.orderBy);
};

AutoCompleteController.prototype.filterOptions = function filterOptions(
  filter,
) {
  if (filter) {
    // eslint-disable-next-line prefer-destructuring
    const displayProperty = this.displayProperty;
    const filtered = [];
    const regExp = new RegExp(filter, 'g');
    angular.forEach(this.options, (item) => {
      if (item[displayProperty].indexOf(filter) !== -1) {
        set(
          item,
          'filteredProperty',
          item[displayProperty].replace(regExp, `<strong>${filter}</strong>`),
        );
        filtered.push(item);
      }
    });

    this.filteredOptions = filtered;
  } else {
    angular.forEach(this.options, (item) => {
      set(item, 'filteredProperty', undefined);
    });
    this.filteredOptions = this.options;
  }
};

AutoCompleteController.prototype.groupOptions = function groupOptions() {
  if (this.groupBy) {
    this.groupedOptions = groupBy(this.filteredOptions, this.groupBy);
  }
};

AutoCompleteController.prototype.changeHighlight = function changeHighlight(
  event,
) {
  const keyCode = event.which || event.keyCode;
  switch (keyCode) {
    case this.keys.arrowUp:
      if (this.editing) {
        this.moveHightlightUp();
        this.updateSelected(
          this.filteredOptions[this.highlightIndex][this.displayProperty],
        );
        event.preventDefault();
      }
      break;
    case this.keys.arrowDown:
      if (this.editing) {
        this.moveHightlightDown();
        this.updateSelected(
          this.filteredOptions[this.highlightIndex][this.displayProperty],
        );
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
};

AutoCompleteController.prototype.confirmChooseItem = function confirmChooseItem(
  item,
  event,
) {
  this.chooseItem(item);
  this.endEdit();

  // If an event is present it means that the function was called by the onclick of an element
  // in which case we don't want it to unfocus the textbox.
  if (event) {
    event.preventDefault();
  }
};

AutoCompleteController.prototype.chooseItem = function chooseItem(itemParam) {
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
};

AutoCompleteController.prototype.updateModel = function updateModel(newModel) {
  this.ngModel = newModel;

  if (newModel) {
    this.updateSelected(newModel[this.displayProperty]);
  } else {
    this.updateSelected(null);
  }
};

AutoCompleteController.prototype.updateSelected = function updateSelected(
  newSelected,
) {
  this.currentSelection = newSelected;
};

AutoCompleteController.prototype.moveHightlightUp = function moveHightlightUp() {
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
};

AutoCompleteController.prototype.moveHightlightDown = function moveHightlightDown() {
  // We check if the user it still editing to avoid DOM errors.
  if (this.editing) {
    if (this.highlightIndex !== this.filteredOptions.length - 1) {
      this.incrementHighlightIndexes();
      this.scrollDownToHighlightedIndex();
    }
  }
};

AutoCompleteController.prototype.scrollDownToHighlightedIndex = function scrollDownToHighlightedIndex() {
  const list = this.getDomList();
  const elem = this.getDomListItems()[this.highlightIndex];
  const listOffsetBottom =
    list.clientHeight + list.scrollTop - elem.offsetHeight;
  if (listOffsetBottom < elem.offsetTop) {
    const scrollPosition =
      elem.offsetTop + elem.offsetHeight - list.clientHeight;
    list.scrollTop = scrollPosition;
  }
};

AutoCompleteController.prototype.getDomList = function getDomList() {
  return document.querySelector('.cloud-autocomplete__list');
};

AutoCompleteController.prototype.getDomListItems = function getDomListItems() {
  return document.querySelectorAll('.cloud-autocomplete__list__item');
};

AutoCompleteController.prototype.preventEvent = function preventEvent(event) {
  event.preventDefault();
};

AutoCompleteController.prototype.incrementHighlightIndexes = function incrementHighlightIndexes() {
  this.highlightIndex += 1;
  this.highlightedGroupIndex += 1;
  this.adjustHighlightGroupIndexes('down');
};

AutoCompleteController.prototype.decrementHighlightIndexes = function decrementHighlightIndexes() {
  this.highlightIndex -= 1;
  this.highlightedGroupIndex -= 1;
  this.adjustHighlightGroupIndexes('up');
};

AutoCompleteController.prototype.adjustHighlightGroupIndexes = function adjustHighlightGroupIndexes(
  direction,
) {
  if (this.groupBy) {
    const currItem = this.filteredOptions[this.highlightIndex];
    this.highlightedGroupKey = this.getArrangedGroupName(
      currItem[this.groupBy],
    );
    let precItem = null;
    switch (direction) {
      case 'up':
        // If we changed group and we are going up, we are on the last element
        // of the previous group.
        precItem = this.filteredOptions[this.highlightIndex + 1];
        if (!precItem || precItem[this.groupBy] !== currItem[this.groupBy]) {
          this.highlightedGroupIndex =
            this.groupedOptions[currItem[this.groupBy]].length - 1;
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
};

AutoCompleteController.prototype.placeHighlightOnModel = function placeHighlightOnModel() {
  // When we open the dropdown and a selection was made beforehand
  // we have to scroll and highlight the selected item.
  if (this.ngModel && !this.ngModel.isNew) {
    const selectedModel = this.ngModel;
    this.highlightIndex = findIndex(
      this.options,
      (item) => item === selectedModel,
    );

    if (this.groupBy) {
      this.highlightedGroupKey = this.getArrangedGroupName(
        this.options[this.highlightIndex][this.groupBy],
      );

      const optionToFind = this.options[this.highlightIndex];
      this.highlightedGroupIndex = findIndex(
        this.groupedOptions[this.highlightedGroupKey],
        (item) => item === optionToFind,
      );
    }
    this.$timeout(this.scrollDownToHighlightedIndex.bind(this));
  }
};

AutoCompleteController.prototype.resetHighlight = function resetHighlight() {
  this.highlightIndex = 0;

  if (this.groupBy) {
    this.highlightedGroupKey = this.getArrangedGroupName(
      this.filteredOptions[0][this.groupBy],
    );
    this.highlightedGroupIndex = 0;
  }
};

AutoCompleteController.prototype.getArrangedGroupName = function getArrangedGroupName(
  groupName,
) {
  return isUndefined(groupName) ? 'undefined' : groupName;
};

angular.module('managerApp').component('cloudAutoComplete', {
  templateUrl: 'components/cloud-ui/autocomplete/autocomplete.html',
  controller: AutoCompleteController,
  bindings: {
    id: '@', // The client ID of the input.  Allows to associate a label with the input.
    name: '@?', // The client name of the input.  Allows to associate a label with the input.
    options: '<', // Options to display in the list.
    groupBy: '@', // options will be grouped by this property.  The component support 1 level of grouping only.
    orderBy: '<', // The order in which we want to order options.  Works like the orderBy in ngRepeat.
    displayProperty: '@', // Given that options is an array of object, the list will display the property described by  displayProperty in the list.
    ngModel: '=', // The model that will be updated when the user select a value.
    ngRequired: '<', // if true the user will have to fill the field.
    ngDisabled: '<', // if true the user won't be able to activate the field.
    groupDescription: '@', // Display an item when the list is grouped that explain what is in the list.  (Like: My OVH services, IPs, etc.)
    placeholder: '@', // A placeholder to show when the input is empty.
  },
});
