import angular from 'angular';
import assign from 'lodash/assign';
import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import pick from 'lodash/pick';

import template from './telecom-telephony-callsFilteringTable.html';

/**
 * Calls filtering table component.
 *
 * Component API input :
 *   fetchAll: function to fetch all the items to load & display (must return a promise).
 *   remove: function to delete an item given its id (must return a promise).
 *
 * Component API output :
 *   update: refresh the component when called.
 *   getList: returns the component's list of items.
 *
 */
export default /* @ngInject */ {
  bindings: {
    api: '=',
  },
  template,
  controller(
    $scope,
    $timeout,
    $filter,
    $q,
    $translate,
    $translatePartialLoader,
    TucToast,
    TucToastError,
  ) {
    'ngInject';

    const self = this;

    self.$onInit = function $onInit() {
      self.screenLists = {
        raw: [],
        paginated: null,
        sorted: null,
        selected: {},
        orderBy: 'callNumber',
        orderDesc: false,
        filterBy: {
          list: undefined,
          type: undefined,
        },
        isDeleting: false,
        isTaskInProgress: false,
      };

      self.poller = $timeout(self.refreshScreenListsPoller, 2000);
      $scope.$on('$destroy', () => {
        $timeout.cancel(self.poller);
      });

      self.api.update = function update() {
        self.updateScreenList();
      };

      self.api.getList = function getList() {
        return angular.copy(self.screenLists.raw);
      };

      $translatePartialLoader.addPart(
        '../components/telecom/telephony/callsFiltering',
      );
      return $translate.refresh().finally(() => {
        self.isInitialized = true;
        return self.refresh();
      });
    };

    self.refresh = function refresh() {
      self.isLoading = true;
      return self
        .updateScreenList()
        .catch((err) => new TucToastError(err))
        .finally(() => {
          self.isLoading = false;
        });
    };

    self.refreshScreenListsPoller = function refreshScreenListsPoller() {
      return self.updateScreenList().finally(() => {
        self.poller = $timeout(self.refreshScreenListsPoller, 5000);
      });
    };

    self.getSelection = function getSelection() {
      return filter(
        self.screenLists.raw,
        (screen) =>
          screen &&
          screen.status !== 'delete' &&
          self.screenLists.selected &&
          self.screenLists.selected[screen.id],
      );
    };

    self.exportSelection = function exportSelection() {
      return map(self.getSelection(), (selection) =>
        pick(selection, ['callNumber', 'nature', 'type']),
      );
    };

    self.updateScreenList = function updateScreenList() {
      return self.api.fetchAll().then((result) => {
        if (result.length === self.screenLists.raw.length) {
          // update
          forEach(result, (screen) => {
            const toUpdate = find(self.screenLists.raw, { id: screen.id });
            if (toUpdate) {
              assign(toUpdate, screen);
            } else {
              self.screenLists.raw.push(screen);
            }
          });
        } else {
          self.screenLists.raw = result;
        }
        self.sortScreenLists();
        self.screenLists.isTaskInProgress =
          filter(self.screenLists.raw, { status: 'active' }).length !==
          self.screenLists.raw.length;
      });
    };

    self.removeSelectedScreenLists = function removeSelectedScreenLists() {
      const screenLists = self.getSelection();
      const queries = screenLists.map(self.api.remove);
      self.screenLists.isDeleting = true;
      queries.push($timeout(angular.noop, 500)); // avoid clipping
      TucToast.info(
        $translate.instant(
          'telephony_calls_filtering_table_status_delete_success',
        ),
      );
      return $q
        .all(queries)
        .then(() => {
          self.screenLists.selected = [];
          return self.updateScreenList();
        })
        .catch((err) => new TucToastError(err))
        .finally(() => {
          self.screenLists.isDeleting = false;
        });
    };

    self.sortScreenLists = function sortScreenLists() {
      let data = angular.copy(self.screenLists.raw);
      data = $filter('filter')(data, self.screenLists.filterBy);
      data = $filter('orderBy')(
        data,
        self.screenLists.orderBy,
        self.screenLists.orderDesc,
      );
      self.screenLists.sorted = data;

      // avoid pagination bug ...
      if (self.screenLists.sorted.length === 0) {
        self.screenLists.paginated = [];
      }
    };

    self.orderScreenListsBy = function orderScreenListsBy(by) {
      if (self.screenLists.orderBy === by) {
        self.screenLists.orderDesc = !self.screenLists.orderDesc;
      } else {
        self.screenLists.orderBy = by;
      }
      self.sortScreenLists();
    };
  },
};
