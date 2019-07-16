angular.module('App').controller(
  'EmailProMXPlanMailingListsSubscribersCtrl',
  class EmailProMXPlanMailingListsSubscribersCtrl {
    /**
     * Constructor
     * @param $scope
     * @param $filter
     * @param $translate
     * @param Alerter
     * @param EmailProMXPlanMailingLists
     * @param exportCsv
     */
    constructor(
      $scope,
      $filter,
      $translate,
      Alerter,
      EmailProMXPlanMailingLists,
      exportCsv,
    ) {
      this.$scope = $scope;
      this.$filter = $filter;
      this.$translate = $translate;
      this.Alerter = Alerter;
      this.EmailProMXPlanMailingLists = EmailProMXPlanMailingLists;
      this.exportCsv = exportCsv;
    }

    $onInit() {
      this.mailingList = this.$scope.ctrlTabView.currentMailingList;
      this.subscribers = {
        selected: [],
        updating: false,
      };
      this.loading = {
        subscribers: false,
        pager: false,
      };
      this.search = { subscribers: '' };

      this.$scope.$on('hosting.tabs.EmailProMXPlanMailingLists.subscribers.refresh', () => this.refreshTableSubscribers());
      this.$scope.$on(
        'EmailProMXPlanMailingLists.subscribers.poll.start',
        (pollObject, task) => {
          if (task.account === this.mailingList.name) {
            const action = task.action.split(':')[0];
            if (_.indexOf(['add', 'del'], action) !== -1) {
              this.subscribers.updating = true;
            }
          }
        },
      );
      this.$scope.$on(
        'EmailProMXPlanMailingLists.subscribers.poll.done',
        (pollObject, task) => {
          if (task.account === this.mailingList.name) {
            const action = task.action.split(':')[0];
            if (_.indexOf(['mailinglist/addSubscriber', 'mailinglist/deleteSubscriber'], action) !== -1) {
              this.runPolling().then((hasPolling) => {
                if (!hasPolling) {
                  this.subscribers.updating = false;
                  this.Alerter.resetMessage(this.$scope.alerts.main);
                  this.refreshTableSubscribers(true);
                }
              });
            }
          }
        },
      );
      this.$scope.$on(
        'EmailProMXPlanMailingLists.subscribers.sendListByEmail.poll.done',
        () => {
          this.Alerter.success(
            this.$translate.instant('mailing_list_tab_modal_sendListByEmail_sent_success'),
            this.$scope.alerts.main,
          );
        },
      );
      this.$scope.$on('$destroy', () => {
        this.EmailProMXPlanMailingLists.killAllPolling({
          namespace: 'EmailProMXPlanMailingLists.subscribers.poll',
        });
        this.EmailProMXPlanMailingLists.killAllPolling({
          namespace: 'EmailProMXPlanMailingLists.subscribers.sendListByEmail.poll',
        });
      });

      this.EmailProMXPlanMailingLists
        .getMailingListLimits(this.mailingList.options.moderatorMessage)
        .then((limits) => {
          this.mailingList.limits = limits;
        });
      this.refreshTableSubscribers();
      this.runPolling();
    }

    //---------------------------------------------
    // Search
    //---------------------------------------------

    emptySearch() {
      this.search.subscribers = '';
      this.refreshTableSubscribers(true);
    }

    goSearch() {
      this.refreshTableSubscribers(true);
    }

    //---------------------------------------------
    // Selector
    //---------------------------------------------

    globalCheckboxStateChange(state) {
      if (this.subscribers.details.length) {
        switch (state) {
          case 0:
            this.subscribers.selected = [];
            break;
          case 1:
            this.subscribers.selected = _.filter(
              _.map(this.subscribers.details, 'email'),
              result => !_.some(this.subscribers.selected, result.email),
            );
            break;
          case 2:
            this.subscribers.selected = this.subscribers.ids;
            break;
          default:
            this.subscribers.selected = [];
        }
        this.applySelection(this.subscribers.details);
      }
    }

    toggleSubscriber(email) {
      this.subscribers.selected = _.xor(this.subscribers.selected, [email]);
    }

    applySelection(subscribers) {
      _.forEach(subscribers, (subscriber) => {
        _.set(subscriber, 'selected', _.indexOf(this.subscribers.selected, subscriber.email) !== -1);
      });
    }

    //---------------------------------------------
    // Subscribers
    //---------------------------------------------

    refreshTableSubscribers(forceRefresh) {
      this.loading.subscribers = true;
      this.subscribers.ids = null;
      this.subscribers.selected = [];

      return this.EmailProMXPlanMailingLists.getSubscribers(_.get(this.$scope, 'exchange.associatedDomainName'), {
        name: this.mailingList.name,
        email: this.search.subscribers ? `%${this.search.subscribers}%` : null,
        forceRefresh,
      })
        .then((data) => {
          this.subscribers.ids = this.$filter('orderBy')(data);
        })
        .catch(err => this.Alerter.alertFromSWS(
          this.$translate.instant('mailing_list_tab_modal_get_lists_error'),
          err,
          this.$scope.alerts.main,
        ))
        .finally(() => {
          if (_.isEmpty(this.subscribers.ids)) {
            this.loading.subscribers = false;
          }
        });
    }

    transformItemSubscriber(item) {
      return this.EmailProMXPlanMailingLists.getSubscriber(
        this.$scope.exchange.associatedDomainName,
        this.mailingList.name,
        item,
      );
    }

    onTransformItemSubscribersDone(items) {
      this.applySelection(items);
      this.loading.subscribers = false;
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
              namespace: 'EmailProMXPlanMailingLists.subscribers.poll',
            });
          }
          return tasks.length > 0;
        })
        .catch(() => false);
    }

    //---------------------------------------------
    // Export CSV
    //---------------------------------------------

    exportSubscribersToCSV() {
      const data = this.exportCsv.exportData({
        separator: ';',
        fileName: `export_${this.mailingList.name}`,
        datas: `${this.$translate.instant('mailing_list_tab_table_header_subscriber_email')}\n${this.subscribers.ids.join('\n')}`,
      });
      this.Alerter.success(
        this.$translate.instant('mailing_list_tab_export_csv_success', { t0: data }),
        this.$scope.alerts.main,
      );
    }
  },
);
