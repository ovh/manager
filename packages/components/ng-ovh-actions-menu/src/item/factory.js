/**
 *  @ngdoc object
 *  @name actionsMenu.object:ActionsMenuItem
 *
 *  @description
 *  Factory that describe an item into an actions menu.
 *
 *  @example
 *  <pre>
 *      angular.module("myManagerApp").controller("MyTestCtrl", function (ActionsMenuItem) {
 *          var actionMenuItem = new ActionsMenuItem({
 *              title: "My Beautiful title",
 *              icon: "filled-check",
 *              href: "http://www.google.be"
 *          });
 *      });
 *  </pre>
 *
 *  @constructor
 *  @param {Object} options Options for creating a new ActionsMenuItem instance.
 *  @param {String} [options.external=false] Is the link is an external link. In other words, will
 *  we be redirected offside of the manager ?
 *  @param {String} [options.href] The href to be redirected if item is clicked. Has no effect if
 *  state option is defined or subItems option is defined.
 *  @param {String} [options.icon] The icon class of the actions menu item icon.
 *  @param {Function} [options.onClick=null] The function to called on click event.
 *  Has to return true if defined.
 *  @param {String} [options.svg] SVG code escaped by using $sce.trustAsHtml method.
 *  @param {String} [options.state] The state to be redirected when item is clicked.
 *  Has no effect if href option is defined or subItems option is defined.
 *  @param {Object} [options.stateParams={}] The params to pass to the state.
 *  @param {Array<Object>} [options.subActions] Sub actions options to be added to the actions
 *  menu item. The options are the same of a first level item options.
    The actionsMenu directive only manage two levels of actions (only level one items with
    potentially sub actions).
 *  @param {String} [options.target=_self] The target of the href anchor tag. This will be the
 *  target html attribute.
 *  @param {String} [options.title] The title of the actions menu item.
 */

import angular from 'angular';

export default function() {
  /*= ==================================
    =            CONSTRUCTOR            =
    =================================== */

  function ActionsMenuItem(options) {
    const self = this;

    this.title = options.title;

    if (options.svg) {
      this.svg = options.svg;
    } else if (options.icon) {
      this.icon = options.icon;
    }

    this.onClick = angular.isFunction(options.onClick) ? options.onClick : null;

    if (options.href && !options.state && !options.subItems) {
      this.href = options.href;
      this.target = options.target || '_top';
      this.external = options.external || false;
    } else if (options.state && !options.href && !options.subItems) {
      this.state = options.state;
      this.stateParams = options.stateParams || {};
    }

    this.subActions = [];
    if (options.subActions && options.subActions.length) {
      angular.forEach(options.subActions, (subActionOptions) => {
        self.addSubAction(subActionOptions);
      });
    }
  }

  /* -----  End of CONSTRUCTOR  ------*/

  /*= ========================================
    =            PROTOTYPE METHODS            =
    ========================================= */

  /**
   *  @ngdoc method
   *  @name actionsMenu.object:ActionsMenuItem#getFullSref
   *  @methodOf actionsMenu.object:ActionsMenuItem
   *
   *  @description
   *  Get the full sref string that will be applied to item that have state defined.
   *
   *  @returns {String} The string representation of a state. For example:
   *  my.manager.state({param1:1, param2:2}).
   */
  ActionsMenuItem.prototype.getFullSref = function getFullSref() {
    const self = this;

    return `${self.state}(${JSON.stringify(self.stateParams)})`;
  };

  /* ----------  SUB ITEMS  ----------*/

  /**
   *  @ngdoc method
   *  @name actionsMenu.object:ActionsMenuItem#addSubAction
   *  @methodOf actionsMenu.object:ActionsMenuItem
   *
   *  @description
   *  Add a sub action item to current actions menu item instance.
   *
   *  @param {Object} subActionOptions Options for creating an actions menu sub item.
   *  See constructor options for more details.
   *
   *  @returns {ActionsMenuItem} The new instance of actions menu item created.
   */
  ActionsMenuItem.prototype.addSubAction = function addSubAction(
    subActionOptions,
  ) {
    const self = this;
    const subAction = new ActionsMenuItem(subActionOptions);

    self.subActions.push(subAction);

    return subAction;
  };

  /**
   *  @ngdoc method
   *  @name actionsMenu.object:ActionsMenuItem#hasSubActions
   *  @methodOf actionsMenu.object:ActionsMenuItem
   *
   *  @description
   *  Check if the instance of actions menu item has sub actions defined.
   *
   *  @returns {Boolean} true if item has subItems, false otherwise.
   */
  ActionsMenuItem.prototype.hasSubActions = function hasSubActions() {
    const self = this;

    return self.subActions.length;
  };

  /* -----  End of PROTOTYPE METHODS  ------*/

  return ActionsMenuItem;
}
