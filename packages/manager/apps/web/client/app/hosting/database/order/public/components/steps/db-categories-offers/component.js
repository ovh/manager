import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    user: '<',
    dbCategories: '<',
    preselectDbCategory: '<',
    onDbCategoryClick: '&',
  },
  controller,
  template,
};

export default component;
