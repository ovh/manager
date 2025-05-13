import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import indexOf from 'lodash/indexOf';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import max from 'lodash/max';
import set from 'lodash/set';
import some from 'lodash/some';
import xor from 'lodash/xor';

export default class MailingListsModeratorsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $filter,
    $stateParams,
    $translate,
    Alerter,
    goToMailingList,
    mailingList,
    MailingLists,
  ) {
    this.$scope = $scope;
    this.$filter = $filter;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.goToMailingList = goToMailingList;
    this.MailingLists = MailingLists;

    this.mailingList = mailingList;
  }

  $onInit() {
    this.moderators = {
      selected: [],
      updating: false,
    };
    this.loading = {
      moderators: false,
      pager: false,
    };
    this.search = { moderators: '' };

    this.$scope.$on('hosting.tabs.mailingLists.moderators.refresh', () =>
      this.refreshTableModerators(),
    );
    this.$scope.$on(
      'mailingLists.moderators.poll.start',
      (pollObject, task) => {
        if (task.account === this.mailingList.name) {
          const action = task.action.split(':')[0];
          if (indexOf(['addm', 'delm'], action) !== -1) {
            this.moderators.updating = true;
          }
        }
      },
    );
    this.$scope.$on('mailingLists.moderators.poll.done', (pollObject, task) => {
      if (task.account === this.mailingList.name) {
        const action = task.action.split(':')[0];
        if (indexOf(['addm', 'delm'], action) !== -1) {
          this.runPolling().then((hasPolling) => {
            if (!hasPolling) {
              this.moderators.updating = false;
              this.Alerter.resetMessage(this.$scope.alerts.main);
              this.refreshTableModerators(true);
            }
          });
        }
      }
    });
    this.$scope.$on('$destroy', () => {
      this.MailingLists.killAllPolling({
        namespace: 'mailingLists.moderators.poll',
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

    return this.MailingLists.getModerators(this.$stateParams.productId, {
      name: this.mailingList.name,
      email: this.search.moderators ? `%${this.search.moderators}%` : null,
      forceRefresh,
    })
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
    return this.MailingLists.getModerator(
      this.$stateParams.productId,
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
    return this.MailingLists.getTaskIds(this.$stateParams.productId, {
      account: this.mailingList.name,
    })
      .then((tasks) => {
        if (tasks.length > 0) {
          this.MailingLists.pollState(this.$stateParams.productId, {
            id: max(tasks),
            mailingList: this.mailingList,
            successStates: ['noState'],
            namespace: 'mailingLists.moderators.poll',
          });
        }
        return tasks.length > 0;
      })
      .catch(() => false);
  }
}
