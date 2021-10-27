import controller from './controller';
import template from './template.html';

export default () => ({
  require: {
    selectCtrl: 'selectCheckboxes',
  },
  controller,
  controllerAs: '$ctrl',
  bindToController: true,
  scope: {
    placeholder: '@',
    items: '<',
    onSelect: '&',
  },
  compile: ($element) => {
    const itemTemplate = $element.html().trim();
    const $template = angular.element(template);
    const templatePlaceholder = $template.find(
      'span[name="templatePlaceholder"]',
    );

    if (itemTemplate) {
      templatePlaceholder.html(itemTemplate);
    }
    const htmlContent = $template[0].outerHTML;
    $element.empty();

    return (scope, elem, attrs, { selectCtrl }) => {
      const ctrl = selectCtrl;
      ctrl.htmlContent = htmlContent;
      return ctrl;
    };
  },
});
