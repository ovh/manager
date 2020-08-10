import get from 'lodash/get';
import isString from 'lodash/isString';
import kebabCase from 'lodash/kebabCase';
import pull from 'lodash/pull';

export default class PrivateDatabaseTabsCtrl {
  /* @ngInject */
  constructor($location, $scope, $stateParams) {
    this.$location = $location;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
  }

  $onInit() {
    this.$scope.toKebabCase = kebabCase;
    this.currentTab = this.$stateParams.tab;

    this.defaultTab = 'STATE';
    this.$scope.tabs = [
      'STATE',
      'USER',
      'DATABASE',
      'WHITELIST',
      'CRON',
      'METRICS',
      'LOGS',
      'CONFIGURATION',
      'TASK',
    ];

    if (get(this.$scope, 'database.serviceInfos.status') === 'expired') {
      this.$scope.tabs = ['STATE'];
    }

    if (this.$scope.isDockerDatabase()) {
      pull(this.$scope.tabs, 'CRON');
    }

    if (this.$scope.isLegacyDatabase()) {
      pull(this.$scope.tabs, 'CONFIGURATION', 'METRICS');
    }

    this.$scope.isConfigSet().then((res) => {
      if (!res) {
        pull(this.$scope.tabs, 'CONFIGURATION');
      }
    });

    if (!this.$scope.isDBaaS()) {
      pull(this.$scope.tabs, 'WHITELIST');
    }

    this.$scope.setSelectedTab = (tab) => {
      if (tab !== undefined && tab !== null && tab !== '') {
        this.$scope.selectedTab = tab;
      } else {
        this.$scope.selectedTab = this.defaultTab;
      }
      this.$location.search('tab', this.$scope.selectedTab);
    };

    if (
      this.currentTab &&
      this.$scope.tabs.indexOf(
        isString(this.currentTab) && this.currentTab.toUpperCase(),
      ) !== -1
    ) {
      this.$scope.setSelectedTab(
        isString(this.currentTab) && this.currentTab.toUpperCase(),
      );
    } else {
      this.$scope.setSelectedTab(this.defaultTab);
    }
  }
}
