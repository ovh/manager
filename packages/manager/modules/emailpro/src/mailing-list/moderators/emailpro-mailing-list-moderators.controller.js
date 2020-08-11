import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import indexOf from 'lodash/indexOf';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import max from 'lodash/max';
import set from 'lodash/set';
import some from 'lodash/some';
import xor from 'lodash/xor';

export default class EmailProMXPlanMailingListsModeratorsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $stateParams,
    $filter,
    $translate,
    Alerter,
    EmailProMXPlanMailingLists,
    goToMailingList,
  ) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$filter = $filter;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.EmailProMXPlanMailingLists = EmailProMXPlanMailingLists;
    this.goToMailingList = goToMailingList;
  }

  $onInit() {
    this.mailingList = this.$stateParams.mailingList;
    this.moderators = {
      selected: [],
      updating: false,
    };
    this.loading = {
      moderators: false,
      pager: false,
    };
    this.search = { moderators: '' };

    this.$scope.$on(
      'hosting.tabs.EmailProMXPlanMailingLists.moderators.refresh',
      () => this.refreshTableModerators(),
    );
    this.$scope.$on(
      'EmailProMXPlanMailingLists.moderators.poll.start',
      (pollObject, task) => {
        if (task.account === this.mailingList.name) {
          const action = task.action.split(':')[0];
          if (
            indexOf(
              ['mailinglist/addModerator', 'mailinglist/deleteModerator'],
              action,
            ) !== -1
          ) {
            this.moderators.updating = true;
          }
        }
      },
    );
    this.$scope.$on(
      'EmailProMXPlanMailingLists.moderators.poll.done',
      (pollObject, task) => {
        if (task.account === this.mailingList.name) {
          const action = task.action.split(':')[0];
          if (
            indexOf(
              ['mailinglist/addModerator', 'mailinglist/deleteModerator'],
              action,
            ) !== -1
          ) {
            this.runPolling().then((hasPolling) => {
              if (!hasPolling) {
                this.moderators.updating = false;
                this.Alerter.resetMessage(this.$scope.alerts.main);
                this.refreshTableModerators(true);
              }
            });
          }
        }
      },
    );
    this.$scope.$on('$destroy', () => {
      this.EmailProMXPlanMailingLists.killAllPolling({
        namespace: 'EmailProMXPlanMailingLists.moderators.poll',
      });
    });

    this.refreshTableModerators();
    this.runPolling();
  }

  //---------------------------------------------
  // Search
  //---------------------------------------------

  emptySearch() {
    this.search.moderators = '';
    this.refreshTableModerators(true);
  }

  goSearch() {
    this.refreshTableModerators(true);
  }

  //---------------------------------------------
  // Selector
  //---------------------------------------------

  globalCheckboxStateChange(state) {
    if (this.moderators.details.length) {
      switch (state) {
        case 0:
          this.moderators.selected = [];
          break;
        case 1:
          this.moderators.selected = filter(
            map(this.moderators.details, 'email'),
            (result) => !some(this.moderators.selected, result.email),
          );
          break;
        case 2:
          this.moderators.selected = this.moderators.ids;
          break;
        default:
          this.moderators.selected = [];
      }
      this.applySelection(this.moderators.details);
    }
  }

  toggleModerator(email) {
    this.moderators.selected = xor(this.moderators.selected, [email]);
  }

  applySelection(moderators) {
    forEach(moderators, (moderator) => {
      set(
        moderator,
        'selected',
        indexOf(this.moderators.selected, moderator.email) !== -1,
      );
    });
  }

  //---------------------------------------------
  // Moderators
  //---------------------------------------------

  refreshTableModerators(forceRefresh) {
    this.loading.moderators = true;
    this.moderators.ids = null;
    this.moderators.selected = [];

    return this.EmailProMXPlanMailingLists.getModerators(
      get(this.$scope, 'exchange.associatedDomainName'),
      {
        name: this.mailingList.name,
        email: this.search.moderators ? `%${this.search.moderators}%` : null,
        forceRefresh,
      },
    )
      .then((data) => {
        this.moderators.ids = this.$filter('orderBy')(data);
      })
      .catch((err) =>
        this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_get_lists_error'),
          err,
          this.$scope.alerts.main,
        ),
      )
      .finally(() => {
        if (isEmpty(this.moderators.ids)) {
          this.loading.moderators = false;
        }
      });
  }

  transformItemModerator(item) {
    return this.EmailProMXPlanMailingLists.getModerator(
      this.$scope.exchange.associatedDomainName,
      this.mailingList.name,
      item,
    );
  }

  onTransformItemModeratorDone(items) {
    this.applySelection(items);
    this.loading.moderators = false;
    this.loading.pager = false;
  }

  runPolling() {
    return this.EmailProMXPlanMailingLists.getTaskIds(
      this.$scope.exchange.associatedDomainName,
      {
        account: this.mailingList.name,
      },
    )
      .then((tasks) => {
        if (tasks.length > 0) {
          this.EmailProMXPlanMailingLists.pollState(
            this.$scope.exchange.associatedDomainName,
            {
              id: max(tasks),
              mailingList: this.mailingList,
              successStates: ['noState'],
              namespace: 'EmailProMXPlanMailingLists.moderators.poll',
            },
          );
        }
        return tasks.length > 0;
      })
      .catch(() => false);
  }
}
