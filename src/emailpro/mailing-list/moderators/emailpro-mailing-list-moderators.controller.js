angular.module('App').controller(
  'EmailProMXPlanMailingListsModeratorsCtrl',
  class EmailProMXPlanMailingListsModeratorsCtrl {
    /**
     * Constructor
     * @param $scope
     * @param $filter
     * @param $translate
     * @param Alerter
     * @param EmailProMXPlanMailingLists
     */
    constructor($scope, $filter, $translate, Alerter, EmailProMXPlanMailingLists) {
      this.$scope = $scope;
      this.$filter = $filter;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.EmailProMXPlanMailingLists = EmailProMXPlanMailingLists;
    }

    $onInit() {
      this.mailingList = this.$scope.ctrlTabView.currentMailingList;
      this.moderators = {
        selected: [],
        updating: false,
      };
      this.loading = {
        moderators: false,
        pager: false,
      };
      this.search = { moderators: '' };

      this.$scope.$on('hosting.tabs.EmailProMXPlanMailingLists.moderators.refresh', () => this.refreshTableModerators());
      this.$scope.$on(
        'EmailProMXPlanMailingLists.moderators.poll.start',
        (pollObject, task) => {
          if (task.account === this.mailingList.name) {
            const action = task.action.split(':')[0];
            if (_.indexOf(['mailinglist/addModerator', 'mailinglist/deleteModerator'], action) !== -1) {
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
            if (_.indexOf(['mailinglist/addModerator', 'mailinglist/deleteModerator'], action) !== -1) {
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
            this.moderators.selected = _.filter(
              _.map(this.moderators.details, 'email'),
              result => !_.some(this.moderators.selected, result.email),
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
      this.moderators.selected = _.xor(this.moderators.selected, [email]);
    }

    applySelection(moderators) {
      _.forEach(moderators, (moderator) => {
        _.set(moderator, 'selected', _.indexOf(this.moderators.selected, moderator.email) !== -1);
      });
    }

    //---------------------------------------------
    // Moderators
    //---------------------------------------------

    refreshTableModerators(forceRefresh) {
      this.loading.moderators = true;
      this.moderators.ids = null;
      this.moderators.selected = [];

      return this.EmailProMXPlanMailingLists.getModerators(_.get(this.$scope, 'exchange.associatedDomainName'), {
        name: this.mailingList.name,
        email: this.search.moderators ? `%${this.search.moderators}%` : null,
        forceRefresh,
      })
        .then((data) => {
          this.moderators.ids = this.$filter('orderBy')(data);
        })
        .catch(err => this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_get_lists_error'),
          err,
          this.$scope.alerts.main,
        ))
        .finally(() => {
          if (_.isEmpty(this.moderators.ids)) {
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
      return this.EmailProMXPlanMailingLists.getTaskIds(this.$scope.exchange.associatedDomainName, {
        account: this.mailingList.name,
      })
        .then((tasks) => {
          if (tasks.length > 0) {
            this.EmailProMXPlanMailingLists.pollState(this.$scope.exchange.associatedDomainName, {
              id: _.max(tasks),
              mailingList: this.mailingList,
              successStates: ['noState'],
              namespace: 'EmailProMXPlanMailingLists.moderators.poll',
            });
          }
          return tasks.length > 0;
        })
        .catch(() => false);
    }
  },
);
