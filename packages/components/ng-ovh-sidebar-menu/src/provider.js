/**
 * @ngdoc object
 * @name sidebarMenu.SidebarMenuProvider
 *
 * @description
 * sidebarMenuProvider allows developper to configure :
 *     - extra translations that need to be loaded ;
 *     - the template path of the inner content of sidebar menu itemms.
 *
 * @example
 * <pre>
 *     angular.module("myManagerApp").config(function (SidebarMenuProvider) {
 *          // add translation path
 *          SidebarMenuProvider.addTranslationPath("../components/sidebar");
 *          // configure the inner item content html file
 *          SidebarMenuProvider.setInnerMenuItemTemplatePath(
 *            "../components/my-dangerous-and-risky-configuration.html"
 *          );
 *      });
 * </pre>
 */

import angular from 'angular';
import {
  assign,
  difference,
  forEach,
  filter,
  find,
  isArray,
  isEmpty,
  isNumber,
  isString,
  map,
  omit,
  pick,
  set,
  some,
} from 'lodash-es';

import innerMenuItemTemplate from './list/item/list-item-inner.html';

export default function() {
  const self = this;

  let translationPaths = [
    '../bower_components/ovh-angular-sidebar-menu/dist/ovh-angular-sidebar-menu',
  ];
  let minItemsForEnablingSearch = 10;

  /*= ====================================
    =            CONFIGURATION            =
    ===================================== */

  /* ----------  TRANSLATION  ----------*/

  /**
   *  @ngdoc function
   *  @name sidebarMenu.SidebarMenuProvider#clearTranslationPath
   *  @methodOf sidebarMenu.SidebarMenuProvider
   *
   *  @description
   *  Clear translations path
   *
   *  @return {Array} The list of translations to load.
   */
  self.clearTranslationPath = function clearTranslationPath() {
    translationPaths = [];
    return translationPaths;
  };

  /**
   *  @ngdoc function
   *  @name sidebarMenu.SidebarMenuProvider#addTranslationPath
   *  @methodOf sidebarMenu.SidebarMenuProvider
   *
   *  @description
   *  Allows you to add an extra translations path when manager sidebar is loading.
   *
   *  @param {String} translationPath The translations file path to add.
   *
   *  @return {Array} The list of translations to load.
   */
  self.addTranslationPath = function addTranslationPath(translationPath) {
    if (translationPath) {
      translationPaths.push(translationPath);
    }

    return translationPaths;
  };

  /* ----------  INNER MENU ITEM TEMPLATE  ----------*/

  /**
   *  @ngdoc function
   *  @name sidebarMenu.SidebarMenuProvider#setMinItemsForEnablingSearch
   *  @methodOf sidebarMenu.SidebarMenuProvider
   *
   *  @description
   *  Configure the minimum items length for enabling search.
   *  By default the min items is set to 10.
   *
   *  @param {Number} minItems The new value for enabling search.
   *
   *  @return {Number} The new value setted.
   */
  self.setMinItemsForEnablingSearch = function setMinItemsForEnablingSearch(
    minItems,
  ) {
    if (isNumber(minItems)) {
      minItemsForEnablingSearch = minItems;
    }

    return minItemsForEnablingSearch;
  };

  /* -----  End of CONFIGURATION  ------*/

  self.$get = [
    '$q',
    '$state',
    'SidebarMenuListItem',
    function $get($q, $state, SidebarMenuListItem) {
      /**
       *  @ngdoc service
       *  @name sidebarMenu.service:SidebarMenu
       *
       *  @requires $q
       *  @requires $state
       *  @requires $translatePartialLoader
       *  @requires SidebarMenuListItem
       *
       *  @description
       *  The `SidebarMenu` service is actual core of sidebarMenu module.
       *  This service manage the content of the sidebar menu and the different state
       *  (active, open, ...) of its items.
       */
      const sidebarMenuService = {
        items: [],
        actionsMenuOptions: [],
        loadDeferred: $q.defer(),
        initPromise: $q.when(true),
      };

      /* ----------  INITIALIZATION LOADING  ----------*/

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#setInitializationPromise
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Let you configuring an initialization promise before displaying content of sidebar-menu.
       *  This can be done in angular run phase.
       *  For example you can configure a promise that return the number of
       *  services per sections, ...
       *
       *  @param {Promise} initPromise A promise object.
       *
       *  @return {Promise} The initialized promise.
       */
      sidebarMenuService.setInitializationPromise = function setInitializationPromise(
        initPromise,
      ) {
        if (initPromise && initPromise.then) {
          this.initPromise = initPromise;
        }

        return initPromise;
      };

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#loadInit
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Load the configured translations and initialization promise.
       *
       *  @return {Promise} That resolve the loadDeferred object with initialization promise
       *  returns values.
       */
      sidebarMenuService.loadInit = function loadInit() {
        return $q
          .all({
            translations: this.loadTranslations(),
            init: this.initPromise,
          })
          .then((data) => {
            this.loadDeferred.resolve(data.init);
            this.manageStateChange();
            return this.loadDeferred.promise;
          });
      };

      /* ----------  TRANSLATIONS  ----------*/

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#loadTranslations
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Load the default translations of manager sidebar component and the extra translations
       *  files that you have added (if some).
       *
       *  @return {Promise} void
       */
      sidebarMenuService.loadTranslations = function() {
        // angular.forEach(translationPaths, function (translationPath) {
        //     $translatePartialLoader.addPart(translationPath);
        // });
        // return $translate.refresh();
      };

      /* ----------  GETTER  ----------*/

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#getInnerMenuItemTemplatePath
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Get the inner menu item template path for displaying the inner html content of an item.
       *
       *  @return {String} The inner menu item template path for displaying the inner html content
       *  of an item. If you have configured it with the provider, this will return the
       *  configured path.
       */
      sidebarMenuService.getInnerMenuItemTemplate = function getInnerMenuItemTemplate() {
        return innerMenuItemTemplate;
      };

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#getMinItemsForEnablingSearch
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Get the minimum items length for enabling search.
       *
       *  @return {Number} The minimum items length for enabling search.
       */
      sidebarMenuService.getMinItemsForEnablingSearch = function() {
        return minItemsForEnablingSearch;
      };

      /* ----------  ITEMS MANAGEMENT  ----------*/

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#addMenuItem
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Add a menu item to manager sidebar. It could be directly added as "root" element or to
       *  an already existing item.
       *
       *  @param {Object} itemOptions The options for adding a new manager sidebar menu item.
       *  See {@link sidebarMenu.object:SidebarMenuListItem SidebarMenuListItem} constructor
       *  for more details.
       *  @param {SidebarMenuListItem} parentItem The parent where to add the new sidebar
       *  menu item. If not specified, a "root" item will be added.
       *
       *  @return {SidebarMenuListItem} The added sidebar menu item.
       */
      sidebarMenuService.addMenuItem = function addMenuItem(
        itemOptions,
        parentItem,
      ) {
        let menuItem;

        if (!parentItem) {
          set(itemOptions, 'level', 1);
          menuItem = new SidebarMenuListItem(itemOptions);
          this.items.push(menuItem);
        } else {
          set(itemOptions, 'level', parentItem.level + 1);
          menuItem = parentItem.addSubItem(itemOptions);
        }

        return menuItem;
      };

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#addMenuItems
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Add multiple sidebar menu items to an existing sidebar menu item (or as "root" items).
       *
       *  @param {Array<Object>} itemsOptions A list of item options to add to sidebar menu.
       *  See {@link sidebarMenu.object:SidebarMenuListItem SidebarMenuListItem} constructor
       *  for more details.
       *  @param {SidebarMenuListItem} parentItem The parent where to add the new sidebar menu
       *  items. If not specified, "root" items will be added.
       *
       *  @return {SidebarMenu} Current SidebarMenu service
       */
      sidebarMenuService.addMenuItems = function addMenuItems(
        itemsOptions,
        parentItem,
      ) {
        angular.forEach(itemsOptions, (itemOptions) => {
          this.addMenuItem(itemOptions, parentItem);
        });

        return this;
      };

      /* ----------  SIDEBAR ACTIONS  ----------*/

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#manageMenuItemOpenAndActiveState
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Manage the open state and the active state of items of the manager sidebar menu.
       *
       *  @param {SidebarMenuListItem} menuItem The clicked sidebar menu item.
       *
       *  @return {SidebarMenu} Current SidebarMenu service
       */
      sidebarMenuService.manageMenuItemOpenAndActiveState = function manageMenuItemOpenAndActiveState(
        menuItem,
      ) {
        return this.toggleMenuItemOpenState(menuItem).manageActiveMenuItem(
          menuItem,
        );
      };

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#toggleMenuItemOpenState
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Manage the open state of items of the manager sidebar menu. This will ensure that only
       *  one item is open at a time.
       *
       *  @param {SidebarMenuListItem} menuItem The clicked sidebar menu item.
       *
       *  @return {SidebarMenu} Current SidebarMenu service
       */
      sidebarMenuService.toggleMenuItemOpenState = function toggleMenuItemOpenState(
        menuItem,
      ) {
        const pathToMenuItem = this.getPathToMenuItem(menuItem).path;
        const openedItems = filter(this.getAllMenuItems(), { isOpen: true });

        // we simply close items that does not belong to the path to menuItem
        forEach(difference(openedItems, pathToMenuItem), (item) => {
          item.toggleOpen(); // close item
        });
        menuItem.toggleOpen();
        return this;
      };

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#manageActiveMenuItem
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Manage the active state of items of the manager sidebar menu. This will ensure that
       *  only one item is active at a time.
       *
       *  @param {SidebarMenuListItem} menuItem The clicked sidebar menu item.
       *
       *  @return {SidebarMenu} Current SidebarMenu service
       */
      sidebarMenuService.manageActiveMenuItem = (function manageActiveMenuItem() {
        let prevItem = null;
        return function manageActiveMenuItemSubFn(menuItem) {
          if (menuItem.state) {
            if (prevItem) {
              prevItem.isActive = false;
            }
            set(menuItem, 'isActive', true);
            prevItem = menuItem;
          }
        };
      })();

      /* ----------  STATE CHANGE  ----------*/

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#manageStateChange
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Manage the active and open state of items when state is successfuly loaded.
       *  Called on $stateChangeSuccess.
       *
       *  @return {Promise} That resolve when every active subMenu item is loaded
       */
      sidebarMenuService.manageStateChange = (function manageStateChange() {
        function manageStateChangeRecur(items) {
          return $q.all(
            map(items, (item) => {
          const stateInfos = getItemStateInfos(item); // eslint-disable-line
              if (stateInfos.current) {
                sidebarMenuService.manageActiveMenuItem(item);
                sidebarMenuService.toggleMenuItemOpenState(item);
              }
              if (stateInfos.included) {
                return item.loadSubItems().then(() => {
                  // Automatically close same level opened item if it is not current one
                  const openedItem = find(
                    sidebarMenuService.getAllMenuItems(),
                    {
                      isOpen: true,
                      level: item.level,
                    },
                  );
                  const someItemIsOpened = openedItem != null;

                  if (someItemIsOpened && openedItem.id !== item.id) {
                    openedItem.toggleOpen();
                  }

                  if (item.hasSubItems() && !item.isOpen) {
                    item.toggleOpen();
                  }
                  sidebarMenuService.manageActiveMenuItem(item);
                  return manageStateChangeRecur(item.getSubItems());
                });
              }
              return $q.when(true);
            }),
          );
        }

        return function(menuItems) {
          return manageStateChangeRecur(menuItems || this.items);
        };
      })();

      /* ----------  ORDER ACTIONS MENU  ----------*/

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#addActionsMenuOption
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Add an item to order actions menu inside sidebar menu.
       *  See availabe options into actions-menu component.
       *
       *  @param {Object} actionMenuOptions Options of the action menu to add
       *  (see availabe options into actions-menu component).
       *
       *  @returns {Object} The added options.
       */
      sidebarMenuService.addActionsMenuOption = function addActionsMenuOption(
        actionMenuOptions,
      ) {
        this.actionsMenuOptions.push(actionMenuOptions);
        return actionMenuOptions;
      };

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#addActionsMenuOptions
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Add multiple items to order actions menu inside sidebar menu.
       *  See availabe options into actions-menu component.
       *
       *  @param {Array<Object>} actionMenuOptionsList List of options for adding entries into
       *  order actions menu (see availabe options into actions-menu component).
       *
       *  @returns {Array<Object>} The list of item options.
       */
      sidebarMenuService.addActionsMenuOptions = function addActionsMenuOptions(
        actionMenuOptionsList,
      ) {
        angular.forEach(actionMenuOptionsList, (actionMenuOptions) => {
          this.addActionsMenuOption(actionMenuOptions);
        });

        return actionMenuOptionsList;
      };

      /* ----------  HELPERS  ----------*/

      function getItemStateInfos(item) {
        const infos = {
          included: false,
          current: false,
        };
        if (item.loadOnState) {
          if (isString(item.loadOnState)) {
            infos.included = $state.includes(
              item.loadOnState,
              item.loadOnStateParams,
            );
            infos.current = $state.is(item.loadOnState, item.loadOnStateParams);
          } else if (isArray(item.loadOnState)) {
            infos.included = some(item.loadOnState, (loadOnState) =>
              $state.includes(loadOnState, item.loadOnStateParams),
            );

            infos.current = some(item.loadOnState, (loadOnState) =>
              $state.is(loadOnState, item.loadOnStateParams),
            );
          }
        } else if (item.state) {
          infos.included = $state.includes(item.state, item.stateParams);
          infos.current = $state.is(item.state, item.stateParams);
        }
        return infos;
      }

      /**
       * @ngdoc method
       * @name sidebarMenu.service:SidebarMenu#getPathToMenuItem
       * @methodOf sidebarMenu.service:SidebarMenu
       *
       * @description
       * Return the path to the specified item in the tree.
       *
       * @param {SidebarMenuListItem} item The item to get the path to
       *
       * @return {Object} Search result : { found: true/false, path: [] }
       */
      sidebarMenuService.getPathToMenuItem = function getPathToMenuItem(
        item,
        itemsParam,
        currentSearchParam,
      ) {
        let items = itemsParam;
        let currentSearch = currentSearchParam;

        currentSearch = currentSearch || { found: false, path: [] };
        if (!angular.isObject(item) || !item.id) {
          return currentSearch;
        }
        items = items || this.items;
        if (find(items, { id: item.id, parentId: item.parentId })) {
          currentSearch.found = true;
          currentSearch.path.push(item);
        } else {
          forEach(items, (child) => {
            if (!currentSearch.found && child.hasSubItems()) {
              currentSearch.path.push(child);
              currentSearch = this.getPathToMenuItem(
                item,
                child.getSubItems(),
                currentSearch,
              );
              if (!currentSearch.found) {
                currentSearch.path.pop();
              }
            }
          });
        }
        return currentSearch;
      };

      /**
       * @ngdoc method
       * @name sidebarMenu.service:SidebarMenu#getAllMenuItems
       * @methodOf sidebarMenu.service:SidebarMenu
       *
       * @description
       * Return a flatten list of all menu items
       *
       * @return {Array} Array of menu items
       */
      sidebarMenuService.getAllMenuItems = (function getAllMenuItems() {
        function flattenSubItems(itemsParam) {
          let items = itemsParam;

          const mapped = map(items, (item) =>
            flattenSubItems(item.getSubItems()),
          );
          forEach(mapped, (item) => {
            items = items.concat(item);
          });
          return items;
        }

        return function() {
          return flattenSubItems(this.items || []);
        };
      })();

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#getItemById
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Find an item, given its id. The search is performed recursively inside the
       *  items tree. Don't be scared of performance issues since search result is
       *  cached, so subsequent search would be O(1) complexity.
       *
       *  @param {Number|String} itemId The unique id of the item you want to find.
       *
       *  @return {SidebarMenuListItem} The founded SidebarMenuListItem with given id.
       */
      sidebarMenuService.getItemById = function getItemById(itemId, items) {
        return this.getItemByCriteria({ id: itemId }, items);
      };

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#getItemByCriteria
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Find an item according to specific criteria.
       *  The search is performed recursively inside the tree of items.
       *  Complexity for subsequent searches will be O(n), except if the
       *  criteria contains the id, then the complexity will be O(1).
       *
       *  @param {Object} criteria The criteria to find the item.
       *
       *  @return {SidebarMenuListItem} The matching SidebarMenuListItem with the given criteria.
       */
      sidebarMenuService.getItemByCriteria = (function getItemByCriteria() {
        const itemsMap = {}; // hash of itemId => item
        let found = false;

        function findRecursive(itemList, criteria) {
          if (!found && itemList && itemList.length) {
            found = find(itemList, criteria);
            forEach(itemList, (item) => {
              findRecursive(item.getSubItems(), criteria);
            });
          }
        }

        return function innerGetItemByCriteria(criteria, items) {
          found = criteria.id
            ? itemsMap[criteria.id]
            : find(itemsMap, criteria);

          findRecursive(items || this.items, criteria);

          if (found) {
            itemsMap[found.id] = found; // cache search result
          }

          return found;
        };
      })();

      /* ----------  ITEM DISPLAY UPDATE  ----------*/

      /**
       *  @ngdoc method
       *  @name sidebarMenu.service:SidebarMenu#updateItemDisplay
       *  @methodOf sidebarMenu.service:SidebarMenu
       *
       *  @description
       *  Update the display options of a SidebarMenuListItem.
       *
       *  @param {Object} displayOptionsParam Display options you want to update.
       *  @param {String} displayOptionsParam.title The new title.
       *  @param {String} displayOptionsParam.prefix The new prefix.
       *  @param {String} displayOptionsParam.icon The new icon.
       *  @param {String} displayOptionsParam.iconClass The new iconClass.
       *  @param {String} displayOptionsParam.category The new category.
       *  @param {String} displayOptionsParam.status The new status.
       *
       *  @param {Number|String|Object} criteriaParam The criteria to find the item to update.
       *  If it's a Number or a String, then it's considered as an id.
       *
       *  @return {SidebarMenuListItem} The matching SidebarMenuListItem with given criteria.
       */
      sidebarMenuService.updateItemDisplay = function updateItemDisplay(
        displayOptionsParam,
        criteriaParam,
      ) {
        let displayOptions = displayOptionsParam;

        const criteria =
          isString(criteriaParam) || isNumber(criteriaParam)
            ? { id: criteriaParam }
            : criteriaParam;

        const item = this.getItemByCriteria(criteria);
        if (item) {
          displayOptions = omit(displayOptions, isEmpty); // remove falsy attributes
          displayOptions = pick(displayOptions, [
            'title',
            'prefix',
            'icon',
            'iconClass',
            'category',
            'status',
          ]);
          assign(item, displayOptions);
        }
        return item;
      };

      return sidebarMenuService;
    },
  ];
}
