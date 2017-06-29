/**
 * @ngdoc overview
 *
 * @name actionsMenu
 *
 *  @requires [pascalprecht.translate](https://github.com/angular-translate/angular-translate)
 *  @requires [responsivePopover](https://github.com/ovh-ux/ovh-angular-responsive-popover)
 *
 * @description
 * _An actions menu gives the opportunity to group a set of actions available for a specific context under a single menu._
 *
 * `actionMenu` module follows the UX specification of the [ovh actions menu guidelines](https://interne.ovh.net/confluence/display/UXGuidelines/Actions+menu).
 *
 *  ## TODO
 *
 *  - customizing page width ;
 *  - customizing open animation ;
 *  - actions with confirmation.
 */

(function () {
    "use strict";

    angular.module("ovh-angular-actions-menu", ["pascalprecht.translate", "responsivePopover"]);
})();
