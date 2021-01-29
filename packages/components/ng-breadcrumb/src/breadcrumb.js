/* eslint-disable */
import { applyPolyfills, defineCustomElements } from '@ovh-ux/manager-breadcrumb/loader';
applyPolyfills().then(() => { defineCustomElements(); });
/* auto-generated angularJS component */
const ovhManagerBreadcrumb = {
  bindings: {
    elements: '<',
  },
  controller: ['$element', class ovhManagerBreadcrumbController {
    constructor($element) {
      this.$element = $element;
    }
    $onInit() {
      this.angularComponent = this.$element[0];
      this.webComponent = this.angularComponent.firstChild;
      this.webComponent.elements = this.elements;
    }
    $onChanges(changes) {
      if (this.webComponent) {
          if(changes.elements !== undefined && !angular.equals(changes.elements.previousValue, changes.elements.currentValue)) {
            this.webComponent.elements = this.elements;
          }
      }
    }
  }],
  template: '<manager-breadcrumb></manager-breadcrumb>',
}
angular
  .module("ovhManagerBreadcrumbModule", [])
  .component("ovhManagerBreadcrumb", ovhManagerBreadcrumb);
export const ovhManagerBreadcrumbModule = "ovhManagerBreadcrumbModule";
export default {
  ovhManagerBreadcrumbModule
}
  