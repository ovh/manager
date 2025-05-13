export default class DualListCtrl {
  /* @ngInject */
  constructor($q, $element, DualListProvider) {
    this.$q = $q;
    this.$element = $element;
    this.dualListProvider = DualListProvider;
  }

  $onInit() {
    this.sourceListLabel =
      this.sourceListLabel ||
      this.dualListProvider.translations.sourceListLabel;
    this.targetListLabel =
      this.targetListLabel ||
      this.dualListProvider.translations.targetListLabel;
    this.moveAllLabel =
      this.moveAllLabel || this.dualListProvider.translations.moveAllLabel;
    this.removeAllLabel =
      this.removeAllLabel || this.dualListProvider.translations.removeAllLabel;
    this.sourceListEmptyLabel =
      this.sourceListEmptyLabel ||
      this.dualListProvider.translations.sourceListEmptyLabel;
    this.targetListEmptyLabel =
      this.targetListEmptyLabel ||
      this.dualListProvider.translations.targetListEmptyLabel;
    this.addLabel =
      this.addLabel || this.dualListProvider.translations.addLabel;
    this.height = this.height || this.dualListProvider.height;
    this.bulkActionEnabled =
      this.bulkActionEnabled || this.dualListProvider.bulkActionEnabled;
    this.sourceList = this.sourceList || [];
    this.targetList = this.targetList || [];
    this.onAdd = this.onAdd || null;
    this.onRemove = this.onRemove || null;
    this.property = this.property || null;

    this.loadingMap = {};
    this.targetCloseIconStyle = {};
    this.targetOpenIconStyle = {};
    this.targetContentStyle = {};
    this.sourceCloseIconStyle = {};
    this.sourceOpenIconStyle = {};
    this.sourceContentStyle = {};
    this.sourceListLoading = false;
    this.targetListLoading = false;
    this.displayNoneStyle = { display: 'none' };
    this.displayBlockStyle = { display: 'inline-block' };
    this.displayFlexStyle = { display: 'flex' };
    this.listHeight = { height: this.height };
    this.loadSourceList();
    this.loadtargetList();
  }

  onTargetContentClose() {
    this.targetCloseIconStyle = this.displayNoneStyle;
    this.targetOpenIconStyle = this.displayBlockStyle;
    this.targetContentStyle = this.displayFlexStyle;
  }

  onTargetContentOpen() {
    this.targetCloseIconStyle = this.displayBlockStyle;
    this.targetOpenIconStyle = this.displayNoneStyle;
    this.targetContentStyle = this.displayNoneStyle;
  }

  onSourceContentClose() {
    this.sourceCloseIconStyle = this.displayNoneStyle;
    this.sourceOpenIconStyle = this.displayBlockStyle;
    this.sourceContentStyle = this.displayFlexStyle;
  }

  onSourceContentOpen() {
    this.sourceCloseIconStyle = this.displayBlockStyle;
    this.sourceOpenIconStyle = this.displayNoneStyle;
    this.sourceContentStyle = this.displayNoneStyle;
  }

  getProperty(item) {
    if (!this.property) {
      return item;
    }
    return this.property
      .split('.')
      .reduce((prev, curr) => (prev ? prev[curr] : undefined), item);
  }

  isLoading(item) {
    const uniqueName = this.getProperty(item);
    if (this.loadingMap[uniqueName]) {
      return true;
    }
    return false;
  }

  setLoading(item, state) {
    const uniqueName = this.getProperty(item);
    this.loadingMap[uniqueName] = state;
  }

  loadSourceList() {
    if (this.sourceListLoading) {
      return this.$q.reject(false);
    }
    this.sourceListLoading = true;
    return this.$q
      .when(this.sourceList)
      .then((items) => {
        this.sourceList = items.data ? items.data : items;
      })
      .finally(() => {
        this.sourceListLoading = false;
      });
  }

  loadtargetList() {
    if (this.targetListLoading) {
      return this.$q.reject(false);
    }
    this.targetListLoading = true;
    return this.$q
      .when(this.targetList)
      .then((items) => {
        this.targetList = items.data ? items.data : items;
      })
      .finally(() => {
        this.targetListLoading = false;
      });
  }

  add(index, item) {
    if (this.isLoading(item)) {
      return;
    }
    this.sourceList.splice(index, 1);
    this.targetList.push(item);
    if (this.onAdd) {
      this.setLoading(item, true);
      this.onAdd({ items: [item] })
        .catch(() => {
          const newIndex = this.targetList.indexOf(item);
          this.targetList.splice(newIndex, 1);
          this.sourceList.push(item);
        })
        .finally(() => this.setLoading(item, false));
    }
  }

  remove(index, item) {
    if (this.isLoading(item)) {
      return;
    }
    this.targetList.splice(index, 1);
    this.sourceList.push(item);
    if (this.onRemove) {
      this.setLoading(item, true);
      this.onRemove({ items: [item] })
        .catch(() => {
          const newIndex = this.sourceList.indexOf(item);
          this.sourceList.splice(newIndex, 1);
          this.targetList.push(item);
        })
        .finally(() => this.setLoading(item, false));
    }
  }

  addAll() {
    const list = this.sourceList.filter((item) => !this.isLoading(item));
    if (list.length === 0) {
      return;
    }
    list.forEach((item) => {
      // move to target list and set loading
      this.targetList.push(item);
      this.setLoading(item, true);
      // remove from source list
      const newIndex = this.sourceList.indexOf(item);
      this.sourceList.splice(newIndex, 1);
    });
    if (this.onAdd) {
      this.onAdd({ items: list }).then(
        () => {
          // all items successfully moved, remove loading
          list.forEach((item) => this.setLoading(item, false));
        },
        (failedItems) => {
          // some or all items failed to move
          failedItems.forEach((item) => {
            // move back to source list and remove loading
            this.sourceList.push(item);
            this.setLoading(item, false);
            // remove from target list
            const newIndex = this.targetList.indexOf(item);
            this.targetList.splice(newIndex, 1);
          });
          // remove loading for all successfull items
          list.forEach((item) => this.setLoading(item, false));
        },
      );
    }
  }

  removeAll() {
    const list = this.targetList.filter((item) => !this.isLoading(item));
    if (list.length === 0) {
      return;
    }
    list.forEach((item) => {
      // move to source list and set loading
      this.sourceList.push(item);
      this.setLoading(item, true);
      // remove from target list
      const newIndex = this.targetList.indexOf(item);
      this.targetList.splice(newIndex, 1);
    });
    if (this.onAdd) {
      this.onAdd({ items: list }).then(
        () => {
          // all items successfully moved, remove loading
          list.forEach((item) => this.setLoading(item, false));
        },
        (failedItems) => {
          // some or all items failed to move
          failedItems.forEach((item) => {
            // move back to target list and remove loading
            this.targetList.push(item);
            this.setLoading(item, false);
            // remove from source list
            const newIndex = this.sourceList.indexOf(item);
            this.sourceList.splice(newIndex, 1);
          });
          // remove loading for all successfull items
          list.forEach((item) => this.setLoading(item, false));
        },
      );
    }
  }
}
