import _ from 'lodash';

export default class PrivateDatabaseTabsCtrl {
  /* @ngInject */

  constructor($location, $scope, $stateParams, $filter) {
    this.$location = $location;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$filter = $filter;
  }

  $onInit() {
    this.$scope.toKebabCase = _.kebabCase;
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

    if (_.get(this.$scope, 'database.serviceInfos.status') === 'expired') {
      this.$scope.tabs = ['STATE'];
    }

    if (this.$scope.isDockerDatabase()) {
      _.pull(this.$scope.tabs, 'CRON');
    }

    if (this.$scope.isLegacyDatabase()) {
      _.pull(this.$scope.tabs, 'CONFIGURATION', 'METRICS');
    }

    this.$scope.isConfigSet().then((res) => {
      if (!res) {
        _.pull(this.$scope.tabs, 'CONFIGURATION');
      }
    });

    if (!this.$scope.isDBaaS()) {
      _.pull(this.$scope.tabs, 'WHITELIST');
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
      this.currentTab
      && this.$scope.tabs.indexOf(this.$filter('uppercase')(this.currentTab)) !== -1
    ) {
      this.$scope.setSelectedTab(this.$filter('uppercase')(this.currentTab));
    } else {
      this.$scope.setSelectedTab(this.defaultTab);
    }
  }
}
