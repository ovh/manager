/**
 *  @ngdoc overview
 *
 *  @name responsivePopover
 *
 *  @requires [matchmedia-ng](https://github.com/AnalogJ/matchmedia-ng)
 *  @requires [ui.bootstrap](https://angular-ui.github.io/bootstrap)
 *
 *  @description
 *  _`responsive-popover` module is used to display a popover and adapt it to the screen dimension._
 *
 *  The two major directives are:
 *      - the `responsivePopover` directive that will display a uibPopover to the DOM element
 *        you instanciate it;
 *      - the `responsivePopoverClass` directive that is added to the popover popup.
 *
 *  **Note:** when ui-bootstrap will be updated to version >= 2.0, it should be possible to remove
 *  `responsivePopover` directive and use uibPopover directive with custom class
 *  responsive-popover-class. So `responsivePopoverClass` directive will be the only directive
 *  of this component.
 *
 */

import angular from 'angular';
import 'angular-ui-bootstrap';
import 'matchmedia-ng';

import ngOvhResponsivePopoverPopup from './popup';

import classDirective from './class/ovh-angular-responsive-popover-class';
import directive from './directive';
import provider from './provider';

import './index.less';

const moduleName = 'ngOvhResponsivePopover';

angular
  .module(moduleName, [
    'matchmedia-ng',
    'ui.bootstrap',
    ngOvhResponsivePopoverPopup,
    classDirective,
  ])
  .directive('responsivePopover', directive)
  .provider('responsivePopover', provider);

export default moduleName;
