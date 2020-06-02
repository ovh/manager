/**
 *  @ngdoc object
 *  @name actionsMenu.object:ActionsMenu
 *
 *  @requires ActionsMenuItem
 *
 *  @description
 *  Factory that describe an actions menu.
 *
 *  A new instance of ActionsMenu is created and used by the actionsMenu directive.
 *
 *  @example
 *  <pre>
 *      angular.module("myManagerApp").controller("MyTestCtrl", function (ActionsMenu) {
 *          var actionMenu = new ActionsMenu({
 *              actionsMenuItems: [{
 *                  title: "My Beautiful title",
 *                  icon: "filled-check",
 *                  href: "http://www.google.be"
 *              }]
 *          });
 *      });
 *  </pre>
 *
 *  @constructor
 *  @param {Object} options Options for creating a new ActionsMenu instance.
 *  @param {Array<Object>} [options.actionsMenuItems=Empty Array] The options of the items that
 *  will be added to the ActionsMenu instance.
 */
import angular from 'angular';

export default /* @ngInject */ function(ActionsMenuItem) {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function ActionsMenu(options) {
    const self = this;

    this.actions = [];

    if (options.actionsMenuItems && options.actionsMenuItems.length) {
      angular.forEach(options.actionsMenuItems, (actionMenuItemOptions) => {
        self.addActionItem(actionMenuItemOptions);
      });
    }
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  /* ----------  ACTIONS MENU ITEMS  ----------*/

  /**
   *  @ngdoc method
   *  @name actionsMenu.object:ActionsMenu#addActionItem
   *  @methodOf actionsMenu.object:ActionsMenu
   *
   *  @description
   *  Add an actions menu item into actions list.
   *
   *  @param {Object} actionMenuItemOptions The options for creating a new action menu item.
   *  See ActionsMenuItem factory for available options.
   *
   *  @returns {ActionsMenuItem} The added actions menu item.
   */
  ActionsMenu.prototype.addActionItem = function addActionItem(
    actionMenuItemOptions,
  ) {
    const self = this;
    const newActionItem = new ActionsMenuItem(actionMenuItemOptions);

    self.actions.push(newActionItem);

    return newActionItem;
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return ActionsMenu;
}
