import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    id: '@', // The client ID of the input.  Allows to associate a label with the input.
    name: '@?', // The client name of the input.  Allows to associate a label with the input.
    options: '<', // Options to display in the list.
    groupBy: '@', // options will be grouped by this property.  The component support 1 level of grouping only.
    orderBy: '<', // The order in which we want to order options.  Works like the orderBy in ngRepeat.
    displayProperty: '@', // Given that options is an array of object, the list will display the property described by  displayProperty in the list.
    ngModel: '=?', // The model that will be updated when the user select a value.
    ngRequired: '<', // if true the user will have to fill the field.
    ngDisabled: '<', // if true the user won't be able to activate the field.
    groupDescription: '@', // Display an item when the list is grouped that explain what is in the list.  (Like: My OVH services, IPs, etc.)
    placeholder: '@', // A placeholder to show when the input is empty.
  },
  controller,
  template,
};
