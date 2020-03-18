import map from 'lodash/map';
import set from 'lodash/set';

export default class {
  /* @ngInject */
  constructor(
    $scope,
  ) {
    this.$scope = $scope;

    this.init();
  }

  init() {
    // this.tabs = this.$scope.tabs = [];
    this.tabs = [];
    // this.tabMore = this.$scope.tabMore = {};
    this.tabMore = {};

    this.destroyed = false;
    this.$scope.$on('$destroy', () => {
      this.destroyed = true;
    });
  }

  setTabs(tabs) {
    this.tabs = tabs;
  }

  select(selectedTab) {
    // reset active state of old active tab

    this.tabs = map(this.tabs, (tab) => {
      if (tab.active && tab !== selectedTab) {
        return {
          ...tab,
          active: false,
        };
      }
      return tab;
    });

    set(selectedTab, 'active', true);

    selectedTab.onSelect();
  }

  addTab(tab) {
    this.tabs.push(tab);
  }

  // Special add for the "more" tab
  addTabMore(tabMore) {
    this.tabMore.$tab = tabMore.$tab;
    this.tabMore.tabs = tabMore.tabs;
  }

  removeTab(tab) {
    const index = this.tabs.indexOf(tab);

    // Select a new tab if the tab to be removed is selected and not destroyed
    if (tab.active && this.tabs.length > 1 && !this.destroyed) {
      // If this is the last tab, select the previous tab. else, the next tab.
      const newActiveIndex = index === this.tabs.length - 1 ? index - 1 : index + 1;
      this.select(this.tabs[newActiveIndex]);
    }
    this.tabs.splice(index, 1);
  }
}
