import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    hds: '<',
    model: '<',
    onHdsCheckboxChanged: '&',
    onHdsLinkClicked: '&',
    onSupportLevelLinkClicked: '&',
  },
  controller,
  template,
};

export default component;
