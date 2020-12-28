/**
 *  @ngdoc object
 *  @name sidebarMenu.object:SidebarMenuListItem
 *
 *  @requires $q
 *
 *  @description
 *  Factory that describe an item into manager sidebar menu.
 *
 *  @example
 *  <pre>
 *      angular.module("myManagerApp").controller("MyTestCtrl", function ($q, SidebarMenuListItem) {
 *          var myMenuItem = new SidebarMenuListItem({
 *              title : "My beautiful title",
 *              state : "manager.my.state"
 *              stateParams : {
 *                  foo : "test",
 *                  test : "foo"
 *              },
 *              icon : "dots",
 *              allowSubItems : true,
 *              onLoad : function () {
 *                  return $q.when([]);
 *              }
 *          });
 *      });
 *  </pre>
 *
 *  @constructor
 *  @param {Object} options Options for creating a new SidebarMenuListItem.
 *  @param {Boolean=} [options.allowSearch=false] Flag telling if item allow search.
 *  Only available for item of level 1.
 *  @param {Boolean=} [options.allowSubItems=false] Flag telling if item allow to have sub items.
 *  If true will display an arrow icon before title.
 *  @param {String=} [options.category=none] Add a category to the item. This will be added as a
 *  new class to the menu item element.
 *  @param {String=} options.icon Icon added before prefix and title. Example : ovh-font icon!
 *  @param {Number|String=} [options.id=A random Number] Unique id of the SidebarMenuListItem.
 *  @param {Number=} options.level Menu item level.
 *  @param {Object} options.viewAllItem Links to a page that manages all subitems.
 *  @param {Object=} options.viewMore Custom object to implement your own pagination method.
 *  @param {String} options.viewMore.title The displayed title of the viewMore button.
 *  @param {Boolean} options.viewMore.enabled Should the viewMore button be displayed?
 *  @param {Boolean} options.viewMore.loading Should a loading spinner be displayed near
 *  the viewMore button?
 *  @param {Function} options.viewMore.action Custom pagination callback to be called when viewMore
 *  button is pressed. If this callback returns a promise, the scrollbar will scroll automatically
 *  to the bottom after the promise is resolved (when your paginated items have been added).
 *  @param {String|Array} options.loadOnState State(s) that will automatically load the menu item.
 *  For this to work, states MUST be declared as parent/child
 *  (example of state name : parent.child.subchild).
 *  @param {Object=} [options.loadOnStateParams={}] StateParams that will that defines the state
 *  that will automatically load the menu item. Ignored if no loadOnState option.
 *  @param {Function=} options.onLoad Function called to load sub items. This function MUST return
 *  a promise.
 *  @param {Number|String=} [options.parentId=null] Unique id of the parent SidebarMenuListItem.
 *  @param {String=} options.prefix Prefix added befor item title.
 *  @param {String=} options.state State name where to redirect when clicking on item. Will be
 *  ignored if both options (state and url) are setted.
 *  @param {Object=} [options.stateParams={}] State params to add when switching state.
 *  Ignored if no state option.
 *  @param {String=} options.status Add a status to the item. This will be added as a new class to
 *  the menu item element.
 *  @param {String=} [options.target=_blank] Target attribute value that will be added to item link.
 *  Ignored if no url option.
 *  @param {String} options.title Title of the the menu item. This is what will be displayed
 *  (cropped if too long and the entire title will be in the title attribute).
 *  @param {String}  [options.error=none] Error message that will be displayed if loding promise
 *  is rejected.
 *  @param {String=} options.url Url to redirect when item link is clicked. Will be ignored
 *  if both options (url and state) are setted.
 *  @param {Boolean} options.infiniteScroll Should infinite scroll be used for scrolling subItems?
 *  @param {Boolean} [options.searchable=true] Flag telling if item is searchable, true by default,
 *  must be set to false to hide it from search.
 *  @param {String} [options.namespace] Namespace equals to Sidebar namespace.
 */

import angular from 'angular';
import { filter, map, now, random, slice } from 'lodash-es';

export default /* @ngInject */ function($q, $timeout) {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function SidebarMenuListItem(options = {}) {
    this.id = options.id || random(now());
    this.parentId = options.parentId || null;

    // for display
    this.title = options.title;
    this.error = options.error;
    this.prefix = options.prefix;
    this.icon = options.icon;
    this.category = options.category || 'none';
    this.status = options.status || 'none';

    this.namespace = options.namespace;

    // level informations
    this.level = options.level;

    // item loading
    this.onLoad = options.onLoad;
    this.loadOnState = options.loadOnState;
    this.loadOnStateParams = options.loadOnStateParams || {};
    this.isLoaded = options.isLoaded || false;
    this.loading = false;

    // state and url management
    if (options.state && !options.url) {
      this.state = options.state;
      this.stateParams = options.stateParams || {};
    } else if (options.url && !options.state) {
      this.url = options.url;
      this.target = options.target || '_blank';
    }

    // sub items
    this.subItems = [];

    /**
     * SubItemsPending is an attempt to optimize performance of sidebar menu.
     * When adding a subItem, it is first added to subItemPending list (which is not displayed).
     * When opening the item, the subItemsPending list is appended to subItems list.
     * It allow subItems to be added to the DOM only when they are displayed and increase a lot
     * performance for when the tree has lots of child nodes.
     */
    this.subItemsPending = [];

    // raw list containing all added subItems (used when clearing search results)
    this.subItemsAdded = [];
    this.allowSubItems = options.allowSubItems || false;
    this.viewAllItem = options.viewAllItem || null;

    // search
    if (this.level === 1) {
      this.allowSearch = options.allowSearch || false;
    }
    this.forceDisplaySearch = options.forceDisplaySearch || false;

    // view more
    this.viewMore = options.viewMore || null;

    this.isOpen = false;
    this.isActive = false;
    this.shouldHide = null;

    // string to perform search on
    this.searchable = options.searchable !== false;
    this.searchKey = angular.isString(this.id) ? this.id : '';
    if (angular.isString(this.title)) {
      this.searchKey += ` ${this.title}`;
    }
    this.searchKey = this.searchKey.toLowerCase();
    this.noSearchResults = false;

    // use sexy infinite scroll?
    this.infiniteScroll = options.infiniteScroll || false;
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  /* ----------  HELPERS  ----------*/

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#hasSubItems
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Check if an item has sub items.
   *
   *  @returns {Boolean} true if item has sub items. false otherwise.
   */
  SidebarMenuListItem.prototype.hasSubItems = function hasSubItems() {
    const self = this;

    // note: subItemsPending are subItems that are not displayed in the DOM
    return self.subItems.length > 0 || self.subItemsPending.length > 0;
  };

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#getSubItems
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Returns the list of sub items.
   *
   *  @returns {Array} the list of sub items.
   */
  SidebarMenuListItem.prototype.getSubItems = function getSubItems() {
    // returns subItems and pending subItems (not already in the dom)
    return this.subItems.concat(this.subItemsPending);
  };

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#getTitle
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Get the full item title. With prefix if setted.
   *
   *  @returns {String} The full item title.
   */
  SidebarMenuListItem.prototype.getTitle = function getTitle() {
    const self = this;

    return self.prefix ? `${self.prefix} ${self.title}` : self.title;
  };

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#getFullSref
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Build the full sref with state name and state params.
   *
   *  @returns {String} The full sref value setted into data-ui-sref item link attribute.
   */
  SidebarMenuListItem.prototype.getFullSref = function getFullSref() {
    return `${this.state}(${JSON.stringify(this.stateParams)})`;
  };

  /* ----------  ACTIONS  ----------*/

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#loadSubItems
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Load the sub items of the current item.
   *
   *  @returns {Promise} That should return the list of sub SidebarMenuListItem instances loaded.
   *  Empty Array if no onLoad function or item does not allow sub items.
   */
  SidebarMenuListItem.prototype.loadSubItems = function loadSubItems(force) {
    const self = this;
    let promise = $q.when([]);

    if (
      self.onLoad &&
      self.allowSubItems &&
      !self.loading &&
      (!self.isLoaded || force)
    ) {
      // set loading flag
      self.loading = true;

      // load items
      promise = self
        .onLoad()
        .then((result) => {
          self.isLoaded = true;
          return result;
        })
        .finally(() => {
          self.loading = false;
        });
    }

    return promise;
  };

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#toggleOpen
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Toggle the open state of the item.
   *
   *  @returns {SidebarMenuListItem} Current instance of menu item.
   */
  SidebarMenuListItem.prototype.toggleOpen = function toggleOpen() {
    if (this.hasSubItems()) {
      this.isOpen = !this.isOpen;
    }

    // append pending subItems so they are displayed in the DOM
    if (this.isOpen && this.subItemsPending.length) {
      // this.appendPendingListItems();
      this.appendPendingListItemsAsync();
    }

    /**
     * Be ready for an awesome performance optimization ...
     *
     * When we close an item, subItems won't be visible so the angular bindings
     * and the DOM content of subItems is a cpu/memory waste right?
     *
     * So, we create a timeout that will eventually free up used $$watchers
     * and DOM element by moving subItems to pendingSubItems (remember that only
     * subItems are rendered in ng-repeat, not pendingSubItems).
     */

    /* eslint-disable no-underscore-dangle */
    if (!this.isOpen) {
      if (this._garbageCollect) {
        $timeout.cancel(this._garbageCollect);
      }
      this._garbageCollect = $timeout(() => {
        if (!this.isOpen) {
          this.subItemsPending = this.subItems.concat(this.subItemsPending);
          this.subItems = [];
        }
      }, 3000);
    }
    /* eslint-enable */

    return this;
  };

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#appendPendingListItems
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Append the pending list of items to the sub items list.
   *  If the list of pending items is large it can be better to call
   *  SidebarMenuListItem#appendPendingListItemsAsync in order to
   *  not freeze the brower by flooding the DOM with subItems directives.
   *
   *  @returns {SidebarMenuListItem} Current instance of menu item.
   */
  SidebarMenuListItem.prototype.appendPendingListItems = function appendPendingListItems() {
    const self = this;
    self.subItems = self.subItems.concat(self.subItemsPending);
    self.subItemsPending = [];
  };

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#appendPendingListItemsAsync
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Append asynchronously the pending list of items to the sub items list.
   *  It allows to not freeze the browser when the list of pending items is large.
   *  Pending items are added in chunks of 5 sequentially by calling timeouts
   *  multiple times.
   *
   *  @returns {SidebarMenuListItem} Current instance of menu item.
   */
  SidebarMenuListItem.prototype.appendPendingListItemsAsync = function appendPdgListItemsAsync() {
    const self = this;

    // timeout is here to wait for scrollbar being redrawn ...
    $timeout(() => {
      const chunk = slice(self.subItemsPending, 0, 5);

      if (self.infiniteScroll && self.getScrollbar) {
        const scrollbar = self.getScrollbar();
        if (scrollbar.visible && !scrollbar.bottom) {
          return;
        }
      }
      if (chunk.length && self.isOpen) {
        self.subItemsPending = self.subItemsPending.slice(chunk.length);
        self.subItems = self.subItems.concat(chunk);
        $timeout(() => {
          self.appendPendingListItemsAsync();
        }, 0);
      }
    });
  };

  /* ----------  ITEMS  ----------*/

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#addSubItem
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Add a sub menu item to sub items list.
   *
   *  @param {Object} subItemOptions Options of sub item that will be added.
   * See constructor for more options informations.
   *
   *  @returns {SidebarMenuListItem} The added sub item.
   */
  SidebarMenuListItem.prototype.addSubItem = function addSubItem(
    subItemOptions,
  ) {
    const self = this;
    let subItem = null;

    if (!self.allowSubItems) {
      return null;
    }

    subItem = new SidebarMenuListItem(
      angular.extend(subItemOptions, {
        parentId: self.id,
      }),
    );

    if (self.isOpen) {
      self.subItems.push(subItem);
    } else {
      // since parent item is not open, we add the child in a temporary list
      // so it will be added to the DOM only when parent will be opened
      self.subItemsPending.push(subItem);
    }

    self.subItemsAdded.push(subItem);

    return subItem;
  };

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#addSubItems
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Add multiple sub items to sub items list.
   *
   *  @param {Array<Object>} subItemsOptions Array of sub items options to add to item.
   *  See constructor for more options informations.
   *
   *  @returns {SidebarMenuListItem} Current instance of menu item.
   */
  SidebarMenuListItem.prototype.addSubItems = function addSubItems(
    subItemsOptions,
  ) {
    if (!this.allowSubItems) {
      return this;
    }

    angular.forEach(subItemsOptions, (subItemOptions) => {
      this.addSubItem(subItemOptions);
    });

    return this;
  };

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#clearSubItems
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Empty list of sub items.
   *
   *  @returns {SidebarMenuListItem} Current instance of menu item.
   */
  SidebarMenuListItem.prototype.clearSubItems = function clearSubItems() {
    this.subItems = [];
    this.subItemsPending = [];
    return this;
  };

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#addSearchKey
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Add a key for when searching / filtering items.
   *
   *  @returns {SidebarMenuListItem} Current instance of menu item.
   */
  SidebarMenuListItem.prototype.addSearchKey = function addSearchKey(key) {
    if (angular.isString(key)) {
      this.searchKey += ` ${key.toLowerCase()}`;
    }
    return this;
  };

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#displaySearchResults
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Update items to display given search results.
   *
   *  @returns {SidebarMenuListItem} Current instance of menu item.
   */
  SidebarMenuListItem.prototype.displaySearchResults = function displaySearchResults(
    result,
  ) {
    const self = this;

    self.subItems = [];
    self.subItemsPending = result;
    self.noSearchResults = result.length === 0;

    // timeout is here so the scrollbar has time to be updated
    // after subItems is cleared, since calling appendPendingListItemsAsync
    // depends on sidebar size to append items
    $timeout(() => {
      self.appendPendingListItemsAsync();
    });

    return self;
  };

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#filterSubItems
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Search for string "search" in item's searchKey and perform the
   *  search recursively in all subItems.
   *  Items not matching the "search" will be removed from the dom.
   *
   *  @returns {SidebarMenuListItem} Current instance of menu item.
   */
  SidebarMenuListItem.prototype.filterSubItems = (function filterSubItems() {
    // Recursively checks if item or subItems are matching the given search query
    // If an item of level 2 matches the search, return it with all subItems
    // If an item of level 3 matches the search, filter and attach it to its parent
    // If no match, return null
    function getMatchingItem(item, search) {
      function isMatchingSearch(itemParam, searchParam) {
        return (
          itemParam.searchable && itemParam.searchKey.indexOf(searchParam) >= 0
        );
      }

      if (isMatchingSearch(item, search)) {
        return item;
      }

      const matchingItem = new SidebarMenuListItem(angular.copy(item));
      angular.forEach(item.getSubItems(), (subItem) => {
        if (isMatchingSearch(subItem, search)) {
          matchingItem.addSubItem(angular.copy(subItem));
        }
      });

      return matchingItem.hasSubItems() ? matchingItem : null;
    }

    return function filterSubItemsInner(searchParam) {
      let search = searchParam;
      const self = this;

      // search nothing => clear results
      if (!angular.isString(search)) {
        self.displaySearchResults(angular.copy(self.subItemsAdded));
      } else {
        search = search.toLowerCase(); // ignore case

        const promises = map(
          filter(self.subItemsAdded, (item) => item.onLoad && !item.isLoaded),
          (item) => item.loadSubItems(),
        );

        $q.all(promises).then(() => {
          const filteredItems = filter(
            map(self.subItemsAdded, (item) => getMatchingItem(item, search)),
          );

          self.displaySearchResults(filteredItems);
        });
      }

      return self;
    };
  })();

  /**
   *  @ngdoc method
   *  @name sidebarMenu.object:SidebarMenuListItem#hide
   *  @methodOf sidebarMenu.object:SidebarMenuListItem
   *
   *  @description
   *  Hide item.
   *
   *  @returns {SidebarMenuListItem} Current instance of menu item.
   */
  SidebarMenuListItem.prototype.hide = function hide() {
    const self = this;
    self.shouldHide = true;
    return self;
  };

  SidebarMenuListItem.prototype.isValidNamespace = function isValidNamespace(
    namespace,
  ) {
    if (Array.isArray(this.namespace)) {
      return this.namespace.includes(namespace);
    }
    return this.namespace === namespace;
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return SidebarMenuListItem;
}
